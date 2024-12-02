import SearchBar from "@/components/SearchBar";
import TextHeader from "@/components/texts/TextHeader";
import TextTitle3 from "@/components/texts/TextTitle3";
import TextTitle5 from "@/components/texts/TextTitle5";
import TextTitle5Gray from "@/components/texts/TextTitle5Gray";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Button,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { getItemAsync } from "expo-secure-store";
import FilterButton from "@/components/FilterButton";
import BakeryCard from "@/components/BakeryCard";
import bakeryApi from "@/api/bakeryApi";
import favoriteApi from "@/api/favoriteApi";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import TextTitle1 from "@/components/texts/TextTitle1";
import categoryApi from "@/api/categoryApi";
import CheckBox from "react-native-check-box";
import CustomButton from "@/components/CustomButton";
import { BakeryType, CategoryType, OrderItemType } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocalStorage, removeLocalStorage } from "@/utils/commonFunctions";
import { set } from "date-fns";
import { icons } from "@/constants/icons";
import Announcement from '@/components/Announcement';

const Bakery = () => {
  const { userData } = useAuth();
  const insets = useSafeAreaInsets();
  const [tempCheckedCategories, setTempCheckedCategories] = useState<number[]>(
    []
  );

  const [checkedCategories, setCheckedCategories] = useState<number[]>([]);
  const [userLocationFilter, setUserLocationFilter] = useState(false);
  const [isExpiringFilter, setIsExpiringFilter] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorite, setShowFavorite] = useState(false);

  const [categoryModal, setCategoryModal] = useState(false);

  const [bakery, setBakery] = useState<BakeryType[]>([]);
  const [category, setCategory] = useState<CategoryType[]>([]);

  const [isSubmitting, setisSubmitting] = useState(false);
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [orderData, setOrderData] = useState<OrderItemType | null>(null);

  const [announcementVisible, setAnnouncementVisible] = useState(false);

  const [isCancelled, setIsCancelled] = useState(0);

  useEffect(() => {
    if (isCancelled > 2) {
      setAnnouncementVisible(true);
    } else {
      setAnnouncementVisible(false);
    }
  }, [isCancelled]);

  const fetchOrderData = async () => {
    try {
      const jsonValue = await getLocalStorage("orderData");
      const data: OrderItemType = jsonValue ? JSON.parse(jsonValue) : null;
      setOrderData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetCategoryApi = async () => {
    try {
      const response = await categoryApi().getCategory();
      if (response.status === 200) {
        setCategory(response.data ? response.data : []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetUserById = async () => {
    try {
      const response = await bakeryApi().getUserById({ userId: userData?.userId });
      if (response.status === 200) {
        setIsCancelled(response.data.isCancelled);
      } else {
        console.log("Failed to fetch user data");
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      handleGetUserById();
    }, [userData?.userId])
  );
  

  useEffect(() => {
    handleGetCategoryApi();
  }, []);

  const handleGetBakeryApi = async () => {
    setIsLoading(true);
    try {
      const response = await bakeryApi().getBakeryWithFilters({
        latitude: userData?.latitude,
        longitude: userData?.longitude,
        categoryId: checkedCategories,
        userLocation: userLocationFilter,
        expiringProducts: isExpiringFilter,
      });

      if (response.status === 200) {
        setBakery(response.data ? response.data : []);
      }
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const filterBakeries = () => {
    const filtered = bakery.filter((item) =>
      item.bakeryName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (showFavorite) {
      return filtered
        .filter((item) =>
          item.favorite.some((fav) => fav.userId === userData?.userId)
        )
        .sort((a, b) => (a.isClosed === b.isClosed ? 0 : a.isClosed ? 1 : -1));
    }

    return filtered.sort((a, b) => (a.isClosed === b.isClosed ? 0 : a.isClosed ? 1 : -1));
    // return bakery.filter((item) =>
    //   item.bakeryName.toLowerCase().includes(searchQuery.toLowerCase())
    // );
  };

  const toggleFavorite = async (bakeryId: number) => {
    const bakeryItem = bakery.find((bakery) => bakery.bakeryId === bakeryId);
    const favoriteItem = bakeryItem?.favorite.find(
      (fav) => fav.userId === userData?.userId
    );

    try {
      if (favoriteItem) {
        await favoriteApi().removeFavorite(favoriteItem.favoriteId);
      } else {
        await favoriteApi().addFavorite({
          userId: userData?.userId,
          bakeryId: bakeryId,
        });
      }

      handleGetBakeryApi();
    } catch (error) {
      console.log(error);
    }
  };

  const handleTempCheckboxClick = (categoryId: number) => {
    setTempCheckedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleApplyCategoryFilter = () => {
    setCheckedCategories(tempCheckedCategories);
    setCategoryModal(false);
  };

  useEffect(() => {
    if (categoryModal) {
      setTempCheckedCategories(checkedCategories);
    }
  }, [categoryModal]);

  useEffect(() => {
    if (!orderData) {
      fetchOrderData();
    }
  }, [orderData]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const data = await getLocalStorage("filter");
        if (data) {
          const parsedData = JSON.parse(data);
          setLocalStorageData(parsedData);
        }
      };

      fetchData();

      return () => {
        removeLocalStorage("filter");
        setLocalStorageData(null);
        setCheckedCategories([]);
        setUserLocationFilter(false);
        setIsExpiringFilter(false);
      };
    }, [])
  );

  useEffect(() => {
    if (!localStorageData) return;

    if (localStorageData.userLocationFilter) {
      setUserLocationFilter(localStorageData.userLocationFilter);
    } else if (localStorageData.isExpiringFilter) {
      setIsExpiringFilter(localStorageData.isExpiringFilter);
    } else if (localStorageData.categoryFilter) {
      setCheckedCategories([localStorageData.categoryFilter]);
    }
  }, [localStorageData]);

  useFocusEffect(
    useCallback(() => {
      handleGetBakeryApi();
    }, [checkedCategories, userLocationFilter, isExpiringFilter])
  );

  return (
    <View className="bg-background h-full flex-1">
      <View style={{ height: insets.top }} />
      <Announcement
        message="Akun Anda diblokir karena telah membatalkan pesanan lebih dari 3 kali."
        visible={announcementVisible}
        onClose={() => setAnnouncementVisible(false)} // Menyembunyikan pengumuman saat ditutup
      />
      <View className="mx-5 mb-5">
        <View className="flex-row align-center justify-between">
          <TextHeader label="BAKERI" />
          <TouchableOpacity
            onPress={() => {
              setShowFavorite(!showFavorite);
            }}
            style={{
              backgroundColor: showFavorite
                ? "rgba(255, 0, 0, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
              borderRadius: 25,
              padding: 8,
            }}
          >
            <Ionicons
              name="heart"
              size={24}
              color={showFavorite ? "red" : "gray"}
            />
          </TouchableOpacity>
        </View>
        <View className="mt-5">
          <SearchBar
            value={searchQuery}
            onChange={(text) => setSearchQuery(text)}
            placeholder="Cari bakeri"
          />
        </View>

        <View className="mt-5 flex-row">
          <FilterButton
            label="Dekat saya"
            isSelected={userLocationFilter}
            onPress={() => {
              userLocationFilter
                ? setUserLocationFilter(false)
                : setUserLocationFilter(true);
            }}
          />
          <FilterButton
            label="Jangan lewatkan"
            isSelected={isExpiringFilter}
            onPress={() => {
              isExpiringFilter
                ? setIsExpiringFilter(false)
                : setIsExpiringFilter(true);
            }}
          />
          <FilterButton
            label="Kategori"
            isSelected={checkedCategories.length > 0}
            onPress={() => setCategoryModal(true)}
          />
        </View>
      </View>

      <View className="flex-1 mx-5">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" color="#828282" />
          </View>
        ) : filterBakeries().length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Image
              source={icons.brokenSearch}
              style={{
                width: 80,
                height: 80,
                marginBottom: 20,
                tintColor: "#828282",
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                color: "#828282",
                fontFamily: "poppinsRegular",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              Bakeri tidak tersedia
            </Text>
          </View>
        ) : (
          <FlatList
            data={filterBakeries()}
            keyExtractor={(item) => item.bakeryId.toString()}
            renderItem={({ item }) => (
              <BakeryCard
                item={item}
                userId={userData?.userId}       // Pass userId to BakeryCard
                isCancelled={isCancelled} // Pass isCancelled to BakeryCard
                onPress={() =>
                  router.push({
                    pathname: "/bakery/bakeryDetail" as any,
                    params: { bakeryId: item.bakeryId, isClosed: item.isClosed.toString() },
                  })
                }
                onFavorite={() => toggleFavorite(item.bakeryId)}
              />
            )}
          />
        )}
      </View>

      {orderData && (
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "#B0795A",
            padding: 15,
            borderRadius: 50,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={() => {
            router.push({
              pathname: "/bakery/bakeryDetail",
              params: { bakeryId: orderData.bakeryId },
            });
          }}
        >
          <Ionicons name="cart" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      <Modal
        visible={categoryModal}
        onRequestClose={() => setCategoryModal(false)}
        animationType="slide"
        presentationStyle="pageSheet"
        className="bg-background"
      >
        <View className="flex-1 p-8">
          <View className="flex-row justify-between items-center">
            <TextTitle1 label="Kategori" />
            <TouchableOpacity
              onPress={() => {
                setCategoryModal(false);
              }}
            >
              <FontAwesome name="close" size={18} color="#B0795A" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={category}
            keyExtractor={(item) => item.categoryId.toString()}
            renderItem={({ item }) => (
              <View className="flex-row items-center w-full justify-between border-b border-gray-200 py-4">
                <TextTitle3 label={item.categoryName} />
                <CheckBox
                  isChecked={tempCheckedCategories.includes(item.categoryId)}
                  onClick={() => handleTempCheckboxClick(item.categoryId)}
                  checkBoxColor="#B0795A"
                />
              </View>
            )}
            className="mt-4"
          />
          <CustomButton
            label="Terapkan"
            handlePress={() => {
              setCategoryModal(false);
              handleApplyCategoryFilter();
            }}
            buttonStyles="mb-4"
            isLoading={isSubmitting}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Bakery;
