import ProductStatusTab from "@/components/ProductStatusTab";
import SearchBar from "@/components/SearchBar";
import TextHeader from "@/components/texts/TextHeader";
import TextTitle3 from "@/components/texts/TextTitle3";
import TextDateGrey from "@/components/texts/TextDateGrey";
import TextRating from "@/components/texts/TextRating";
import productApi from "@/api/productApi";
import { useAuth } from "@/app/context/AuthContext";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacityBase,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextTitle4 from "@/components/texts/TextTitle4";
import TextTitle5Date from "@/components/texts/TextTitle5Date";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

interface ListDiscount {
  discountId: number;
  productId: number;
  discountDate: Date;
  discountAmount: number;
}

interface Product {
  productId: number;
  bakeryId: number;
  categoryId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productDescription: string;
  productCreatedDate: Date;
  productExpirationDate: Date;
  productStock: number;
  isActive: number;
  discount: ListDiscount[];
}

const ListProduct = () => {
  const [selectedStatus, setSelectedStatus] = useState<number>(1);
  const { userData } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleGetProductsByBakeryId = async () => {
    const bakeryId = userData?.bakery?.bakeryId;

    try {
      setIsLoading(true);
      const response = await productApi().getProductsByBakery({ bakeryId });
      if (response && Array.isArray(response)) {
        setProducts(response);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      handleGetProductsByBakeryId();
    }, [])
  );

  useEffect(() => {
    handleGetProductsByBakeryId();
    console.log("products", products);
  }, [selectedStatus]);

  const filteredProducts = products.filter((product) => {
    const matchesStatus = product.isActive === selectedStatus;
    const matchesSearchQuery =
      searchQuery === "" ||
      product.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearchQuery;
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (selectedStatus === 1) {
      return dayjs(a.productExpirationDate).diff(dayjs(b.productExpirationDate));
    } else if (selectedStatus === 2) {
      return dayjs(b.productExpirationDate).diff(dayjs(a.productExpirationDate));
    }
    return 0;
  });

  return (
    <SafeAreaView className="bg-background h-full flex-1">
      <View className="bg-white">
        <View className="mx-5 flex-row items-center justify-between">
          <TextHeader label="DAFTAR PRODUK" />
          <TouchableOpacity
            onPress={() => {
              router.push("/product/createProduct");
            }}
          >
            <Ionicons name="add-outline" size={24} color="#b0795a" />
          </TouchableOpacity>
        </View>
        <View className="mx-5 mt-6">
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
          placeholder="Roti kismis, roti keju..."
          onChange={(text) => setSearchQuery(text)}
        />
      </View>

      <View>
        <View className="mx-5 mt-4">
          <FlatList
            data={sortedProducts}
            keyExtractor={(item) => item.productId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/product/editProduct" as any,
                    params: { productId: item.productId },
                  })
                }
                className="bg-white rounded-lg shadow-md mb-4 pt-4 pb-4 pl-5 pr-5 flex-row"
              >
                {/* <View className="bg-white rounded-lg shadow-md mb-4 pt-4 pb-4 pl-5 pr-5 flex-row"> */}
                <Image
                  source={{ uri: item.productImage }}
                  className="w-20 h-20 mr-4"
                  style={{ borderRadius: 10 }}
                />

                <View className="flex-1 justify-between">
                  <View className="flex-row justify-between items-start">
                    <TextTitle3 label={item.productName} />
                    <View
                      style={{
                        backgroundColor: "#FA6F33",
                        paddingHorizontal: 10,
                        paddingVertical: 2,
                        borderRadius: 999,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 10,
                          fontFamily: "poppinsMedium",
                        }}
                      >
                        {item.productStock} tersisa
                      </Text>
                    </View>
                  </View>

                  <TextDateGrey
                    label={
                      "EXP: " +
                      dayjs(item.productExpirationDate).format("DD/MM/YYYY")
                    }
                  />

                  <View className="flex-row justify-end mt-2">
                    <TextTitle4
                      label={`Rp ${item.productPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}
                    />
                  </View>
                </View>
                {/* </View> */}
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 200 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ListProduct;
