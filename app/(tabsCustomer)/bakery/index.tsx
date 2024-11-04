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
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import TextTitle1 from "@/components/texts/TextTitle1";
import categoryApi from "@/api/categoryApi";
import CheckBox from 'react-native-check-box'
import CustomButton from "@/components/CustomButton";
import { BakeryType, CategoryType } from "@/types/types";

const Bakery = () => {

  const { userData } = useAuth();
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
  const [showFavorite, setShowFavorite] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string[]>([]);

  const [categoryModal, setCategoryModal] = useState(false);

  const [bakery, setBakery] = useState<BakeryType[]>([]);
  const [category, setCategory] = useState<CategoryType[]>([]);

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

  // Filtering logics
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

        if (updatedFilters.includes("Dekat saya")) {
          handleGetBakeryByRegionApi();
        } else {
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

        {/* TO DO: update the path to bakery detail */}
        <View className="mt-5 h-full">
          <FlatList
            data={filterBakeries()}
            keyExtractor={(item) => item.bakeryId.toString()}
            renderItem={({ item }) => (
              <BakeryCard
                item={item}
                onPress={() => router.push({
                  pathname: '/bakery/bakeryDetail' as any,
                  params: { bakeryId: item.bakeryId }
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
