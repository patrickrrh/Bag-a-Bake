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
  Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import CheckBox from 'react-native-check-box'
import CustomButton from "@/components/CustomButton";
import { BakeryType, CategoryType } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Bakery = () => {

  const { userData } = useAuth();
  const [tempCheckedCategories, setTempCheckedCategories] = useState<number[]>([]);
  const [checkedCategories, setCheckedCategories] = useState<number[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorite, setShowFavorite] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string[]>([]);

  const [categoryModal, setCategoryModal] = useState(false);

  const [bakery, setBakery] = useState<BakeryType[]>([]);
  const [category, setCategory] = useState<CategoryType[]>([]);

  const [isSubmitting, setisSubmitting] = useState(false);
  const [localStorageData, setLocalStorageData] = useState<any>(null);

  const getLocalStorage = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        setLocalStorageData(value);
      }
    } catch (error) {
      console.log("Failed to get local storage:", error);
    }
  }

  const removeLocalStorage = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
      setLocalStorageData(null);
    } catch (error) {
      console.log("Failed to remove local storage:", error);
    }
  }

  const handleGetCategoryApi = async () => {
    try {
      const response = await categoryApi().getCategory();
      if (response.status === 200) {
        setCategory(response.data ? response.data : []);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetCategoryApi();
  }, []);

  const handleGetBakeryApi = async () => {
    try {
      setBakery([]);

      let response;

      if (checkedCategories.length > 0) {
        const categoryIds = checkedCategories.map(item => item);
        response = await bakeryApi().getBakeryByCategory({
          categoryId: categoryIds,
        });
      } else if (activeFilter.includes("Dekat saya")) {
        response = await bakeryApi().getBakeryByRegion({
          regionId: userData?.regionId,
        })
      } else {
        response = await bakeryApi().getBakery();
      }

      if (response.status === 200) {
        let fetchedBakery = response.data ? response.data : [];

        if (checkedCategories.length > 0 && activeFilter.includes("Dekat saya")) {
          fetchedBakery = fetchedBakery.filter((item: { regionId: number; }) => item.regionId === userData?.regionId);
        }
        setBakery(fetchedBakery);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const filterBakeries = () => {
    if (showFavorite) {
      const favoriteBakeries = bakery.filter(item =>
        item.favorite.some(fav => fav.userId === userData?.userId)
      );

      return favoriteBakeries.filter(item =>
        item.bakeryName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return bakery.filter(item =>
      item.bakeryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  //TO DO: update this to local state
  const toggleFavorite = async (bakeryId: number) => {
    const bakeryItem = bakery.find(bakery => bakery.bakeryId === bakeryId);
    const favoriteItem = bakeryItem?.favorite.find(fav => fav.userId === userData?.userId);

    try {
      if (favoriteItem) {
        await favoriteApi().removeFavorite(favoriteItem.favoriteId)
      } else {
        await favoriteApi().addFavorite({
          userId: userData?.userId,
          bakeryId: bakeryId
        })
      }

      handleGetBakeryApi();
    } catch (error) {
      console.log(error);
    }
  }

  const handleActiveFilter = (filter: string) => {
    setActiveFilter((prevFilters) => {
      let updatedFilters;

      if (filter !== "Kategori") {
        if (prevFilters.includes(filter)) {
          updatedFilters = prevFilters.filter(f => f !== filter);
        } else {
          updatedFilters = [...prevFilters, filter];
        }
      } else {
        updatedFilters = prevFilters;
        setCategoryModal(true);
      }

      return updatedFilters;
    });
  };

  useEffect(() => {
    setActiveFilter((prevFilters) => {
      if (checkedCategories.length > 0) {
        if (!prevFilters.includes("Kategori")) {
          return [...prevFilters, "Kategori"];
        }
        return prevFilters;
      }

      return prevFilters.filter((f) => f !== "Kategori");
    });
    handleGetBakeryApi();
  }, [checkedCategories]);

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

  useFocusEffect(
    useCallback(() => {
      getLocalStorage('filter');

      return () => {
        removeLocalStorage('filter');
        setActiveFilter([]);
        setCheckedCategories([]);
      };
    }, [])
  );

  useEffect(() => {
    if (!localStorageData) return;

    if (localStorageData === 'Dekat saya') {
      handleActiveFilter(localStorageData);
    } else {
      let productItem: any[] = [];
      try {
        if (localStorageData) {
          const parsedProducts = JSON.parse(localStorageData as string);

          if (typeof parsedProducts === 'object' && !Array.isArray(parsedProducts)) {
            productItem.push(parsedProducts);
          } else if (Array.isArray(parsedProducts)) {
            productItem = [...parsedProducts];
          } else {
            console.error("Parsed product is neither an array nor an object");
          }

          const categoryId = productItem[0].categoryId;
          setCheckedCategories([categoryId]);
        }
      } catch (error) {
        console.error("Failed to parse product:", error);
      }
    }
  }, [localStorageData]);

  useEffect(() => {
    handleGetBakeryApi();
  }, [activeFilter]);

  console.log("local storage data:", localStorageData)
  console.log("checked categories:", checkedCategories);

  return (
    <SafeAreaView className="bg-background h-full flex-1">
      <View className="mx-5">
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
            onChange={setSearchQuery}
            placeholder="Cari bakeri disini"
          />
        </View>

        <View className="mt-5 flex-row">
          <FilterButton
            label="Jangan lewatkan"
            isSelected={activeFilter.includes("Jangan lewatkan")}
            onPress={() => handleActiveFilter("Jangan lewatkan")}
          />
          <FilterButton
            label="Dekat saya"
            isSelected={activeFilter.includes("Dekat saya")}
            onPress={() => handleActiveFilter("Dekat saya")}
          />
          <FilterButton
            label="Kategori"
            isSelected={activeFilter.includes("Kategori")}
            onPress={() => handleActiveFilter("Kategori")}
          />
        </View>

        {/* TO DO: update the path to bakery detail */}
        <View className="mt-5 h-full">
          <FlatList
            data={filterBakeries()}
            keyExtractor={(item) => item.bakeryId.toString()}
            renderItem={({ item }) => (
              <BakeryCard
                item={item}
                onPress={() => router.push({
                  pathname: '/bakery/bakeryDetail' as any
                })}
                onFavorite={() => toggleFavorite(item.bakeryId)}
              />
            )}
          />
        </View>
      </View>

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
              }}>
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

    </SafeAreaView>
  );
};

export default Bakery;
