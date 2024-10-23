import SearchBar from "@/components/SearchBar";
import TextHeader from "@/components/texts/TextHeader";
import TextTitle3 from "@/components/texts/TextTitle3";
import TextTitle5 from "@/components/texts/TextTitle5";
import TextTitle5Gray from "@/components/texts/TextTitle5Gray";
import React, { useEffect, useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { getItemAsync } from "expo-secure-store";
import FilterButton from "@/components/FilterButton";
import BakeryCard from "@/components/BakeryCard";
import bakeryApi from "@/api/bakeryApi";
import favoriteApi from "@/api/favoriteApi";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/AuthContext";
import TextTitle1 from "@/components/texts/TextTitle1";
import categoryApi from "@/api/categoryApi";
import CheckBox from 'react-native-check-box'
import CustomButton from "@/components/CustomButton";

type Bakery = {
  bakeryId: number;
  userId: number;
  regionId: number;
  bakeryName: string;
  bakeryImage: string;
  bakeryDescription: string;
  bakeryPhoneNumber: string;
  openingTime: string;
  closingTime: string;
}

type Category = {
  categoryId: number;
  categoryName: string;
  categoryImage: string;
}

const Bakery = () => {

  const { userData, signOut } = useAuth();
  const [tempCheckedCategories, setTempCheckedCategories] = useState<number[]>([]);
  const [checkedCategories, setCheckedCategories] = useState<number[]>([]);

  const { product } = useLocalSearchParams();

  useEffect(() => {
    let productItem: any[] = [];
    try {
      if (product) {
        const parsedProducts = JSON.parse(product as string);

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
  }, [product]);

  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavorite, setShowFavorite] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string[]>([]);

  const [categoryModal, setCategoryModal] = useState(false);

  const [bakery, setBakery] = useState<Bakery[]>([]);
  const [category, setCategory] = useState<Category[]>([]);

  const [isSubmitting, setisSubmitting] = useState(false);

  const handleGetBakeryApi = async () => {
    try {
      setBakery([]);
      if (checkedCategories.length > 0) {
        const categoryIds = checkedCategories.map(item => item);

        const response = await bakeryApi().getBakeryByCategory({
          categoryId: categoryIds,
        });
        if (response.status === 200 && response.data) {
          setBakery(response.data ? response.data : []);
        }
      } else {
        const response = await bakeryApi().getBakery();
        if (response.status === 200) {
          setBakery(response.data ? response.data : []);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleGetBakeryByRegionApi = async () => {
    try {
      const response = await bakeryApi().getBakeryByRegion({
        regionId: userData?.regionId,
      });
      if (response.status === 200) {
        setBakery(response.data ? response.data : []);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleGetFavoriteBakeryApi = async () => {
    try {
      const response = await favoriteApi().getFavorite({
        userId: userData?.userId,
      });
      if (response.status === 200) {
        const bakeryData = response.data.map((favorite: { bakery: object; }) => favorite.bakery);      
        setBakery(bakeryData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const filteredStores = bakery.filter((bakery) => {
    const isMatch = bakery.bakeryName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return isMatch;
  });

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

  // const toggleFavorite = (storeId: number) => {
  //   setFavorites((prevFavorites) =>
  //     prevFavorites.includes(storeId)
  //       ? prevFavorites.filter((id) => id !== storeId)
  //       : [...prevFavorites, storeId]
  //   );
  // };

  const toggleFavorite = async (bakeryId: number) => {
    await favoriteApi().addFavorite({
      userId: userData?.userId,
      bakeryId: bakeryId
    })
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

        console.log("masuk mana")
  
        if (updatedFilters.includes("Dekat saya")) {
          handleGetBakeryByRegionApi();
        } else {
          console.log("masuk sini?")
          handleGetBakeryApi();
        }
      } else {
        updatedFilters = prevFilters;
        setCategoryModal(true);
      }
  
      return updatedFilters;
    });
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
    handleGetCategoryApi();
  }, []);

  useEffect(() => {
    handleGetBakeryApi();

    setActiveFilter((prevFilters) => {
      if (checkedCategories.length > 0) {
        if (!prevFilters.includes("Kategori")) {
          return [...prevFilters, "Kategori"];
        }
        return prevFilters;
      }

      return prevFilters.filter((f) => f !== "Kategori");
    });
  }, [checkedCategories]);

  useEffect(() => {
    if (categoryModal) {
      setTempCheckedCategories(checkedCategories);
    }
  }, [categoryModal]);

  useEffect(() => {
    if (showFavorite) {
      handleGetFavoriteBakeryApi();
    } else {
      handleGetBakeryApi();
    }
  }, [showFavorite]);

  console.log("bakery", JSON.stringify(bakery, null, 2));

  // console.log('bakery', JSON.stringify(bakery, null, 2));
  // console.log("category", checkedCategories);
  // console.log("temp", tempCheckedCategories)

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

        <View className="mt-5 h-full">
          <FlatList
            data={filteredStores}
            keyExtractor={(item) => item.bakeryId.toString()}
            renderItem={({ item }) => (
              <BakeryCard
                item={item}
                favoriteStores={favorites}
                onPress={() => { }}
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
          <View className="flex-row justify-between">
            <TextTitle1 label="Kategori" />
            <Button
              title="Tutup"
              onPress={() => {
                setCategoryModal(false);
              }} />
          </View>
          <FlatList
            data={category}
            keyExtractor={(item) => item.categoryId.toString()}
            renderItem={({ item }) => (
              <View className="border-b border-gray-200 py-4">
                <CheckBox
                  leftText={<TextTitle3 label={item.categoryName} /> as any}
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
