import ProductStatusTab from "@/components/ProductStatusTab";
import SearchBar from "@/components/SearchBar";
import TextHeader from "@/components/texts/TextHeader";
import TextTitle3 from "@/components/texts/TextTitle3";
import { icons } from "@/constants/icons";
import TextDateGrey from "@/components/texts/TextDateGrey";
import TextRating from "@/components/texts/TextRating";
import productApi from "@/api/productApi";
import { useAuth } from "@/app/context/AuthContext";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import TextTitle4 from "@/components/texts/TextTitle4";
import TextTitle5Date from "@/components/texts/TextTitle5Date";
import { router, useFocusEffect } from "expo-router";
import ListProductCard from "@/components/ListProductCard";
import Toast from "react-native-toast-message";
import { ProductType } from "@/types/types";

const ListProduct = () => {
  const { userData } = useAuth();
  const insets = useSafeAreaInsets();

  const [selectedStatus, setSelectedStatus] = useState<number>(1);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleGetProductsByBakeryId = async (isActive: number) => {
    setIsLoading(true);

    try {
      const response = await productApi().getProductsByBakery({
        bakeryId: userData?.bakery?.bakeryId,
        isActive,
      });
      if (response.status === 200) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  useFocusEffect(
    useCallback(() => {
      if (selectedStatus === 1) {
        handleGetProductsByBakeryId(1);
      } else {
        handleGetProductsByBakeryId(2);
      }

      return () => {
        setProducts([]);
      };
    }, [])
  );

  useEffect(() => {
    setProducts([]);
    if (selectedStatus === 1) {
      handleGetProductsByBakeryId(1);
    } else {
      handleGetProductsByBakeryId(2);
    }
  }, [selectedStatus]);

  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery =
      searchQuery === "" ||
      product.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearchQuery;
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (selectedStatus === 1) {
      return dayjs(a.productExpirationDate).diff(
        dayjs(b.productExpirationDate)
      );
    } else if (selectedStatus === 2) {
      return dayjs(b.productExpirationDate).diff(
        dayjs(a.productExpirationDate)
      );
    }
    return 0;
  });

  return (
    <View className="flex-1">
      <View
        style={{
          backgroundColor: "white",
          height: insets.top,
        }}
      />
      
      {/* <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <Toast topOffset={50} />
      </View> */}

      <View className="bg-background h-full flex-1">
        <View className="px-5 bg-white">
          <View className="flex-row items-center justify-between">
            <TextHeader label="DAFTAR PRODUK" />
            <TouchableOpacity
              onPress={() => {
                router.push("/product/createProduct");
              }}
            >
              <Ionicons name="add-outline" size={24} color="#b0795a" />
            </TouchableOpacity>
          </View>

          <View className="mt-6">
            <ProductStatusTab
              selectedStatus={selectedStatus}
              onSelectStatus={(status) => {
                setSelectedStatus(status);
                setSearchQuery("");
              }}
            />
          </View>
        </View>

        <View className="mx-5 mt-4">
          <SearchBar
            value={searchQuery}
            placeholder="Roti coklat, roti keju..."
            onChange={(text) => setSearchQuery(text)}
          />
        </View>

        <View className="flex-1 mx-5">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="small" color="#828282" />
            </View>
          ) : (
            <>
              {sortedProducts.length === 0 ? (
                <View className="flex-1 items-center justify-center">
                  <Image
                    source={icons.bakeBread}
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
                    {selectedStatus === 1
                      ? "Anda tidak memiliki produk aktif"
                      : "Anda tidak memiliki riwayat produk"}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={sortedProducts}
                  keyExtractor={(item) => item.productId.toString()}
                  renderItem={({ item }) => (
                    <ListProductCard
                      item={item}
                      onPress={() => {
                        router.push({
                          pathname: "/product/editProduct",
                          params: { productId: item.productId },
                        });
                      }}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                />
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default ListProduct;
