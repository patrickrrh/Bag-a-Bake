import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StatusBar, FlatList, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '@/constants/images';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextTitle5Bold from '@/components/texts/TextTitle5Bold';
import SearchBar from '@/components/SearchBar';
import TextTitle3 from '@/components/texts/TextTitle3';
import categoryApi from '@/api/categoryApi';
import productApi from '@/api/productApi';
import CategoryCard from '@/components/CategoryCard';
import TextLink from '@/components/texts/TextLink';
import { router, useFocusEffect } from 'expo-router';
import ProductCard from '@/components/ProductCard';
import { icons } from '@/constants/icons';
import { useAuth } from '../context/AuthContext';
import CustomButton from '@/components/CustomButton';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { getLocalStorage, setLocalStorage } from '@/utils/commonFunctions';
import { CategoryType, ProductType } from '@/types/types';
import getDistance from 'geolib/es/getDistance';

const Home = () => {

  const { userData } = useAuth();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const [category, setCategory] = useState<CategoryType[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductType[]>([]);
  const [expiringProducts, setExpiringProducts] = useState<ProductType[]>([]);
  const [isSubmitting, setisSubmitting] = useState(false);

  const handleGetCategoryApi = async () => {
    try {
      const response = await categoryApi().getCategory();
      if (response.status === 200) {
        setCategory(response.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetRecommendedProducts = async () => {
    try {
      const response = await productApi().getRecommendedProducts({
        latitude: userData?.latitude,
        longitude: userData?.longitude
      });
      if (response.status === 200) {
        setRecommendedProducts(response.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetExpiringProducts = async () => {
    try {
      const response = await productApi().getExpiringProducts({
        latitude: userData?.latitude,
        longitude: userData?.longitude
      });
      if (response.status === 200) {
        setExpiringProducts(response.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      handleGetCategoryApi();
      handleGetRecommendedProducts();
      handleGetExpiringProducts();
    }, [])
  )

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      handleGetRecommendedProducts();
      handleGetExpiringProducts();
      setRefreshing(false);
    }, 1000);
  }

  return (
    <View className='flex-1 bg-brown'>

      <View style={{ backgroundColor: '#B0795A', height: insets.top }} />

      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* Header */}
        <View
          className='bg-brown px-5 pt-2 pb-2'
          style={{
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          <View className='flex-row justify-between items-center w-full mb-7'>
            <View className="w-10 h-10 border border-gray-200 rounded-full">
              <Image
                source={userData?.userImage ? { uri: userData?.userImage } : images.profile}
                className="w-full h-full rounded-full"
              />
            </View>
            <View className="flex-col items-center gap-y-1">
              <Text style={{ fontFamily: "poppinsLight", fontSize: 12, color: "white" }}>Alamat Anda</Text>
              <View className="flex-row">
                <Ionicons name="location-sharp" size={12} color="white" style={{ marginRight: 5 }} />
                <Text
                  style={{ fontFamily: "poppinsSemiBold", fontSize: 12, color: "white", maxWidth: 200 }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {userData?.address}
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => { }}
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  borderRadius: 25,
                  padding: 8,
                }}
                className='w-10 h-10 justify-center items-center'
              >
                <FontAwesome name="bell" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className='bg-background px-5 pb-5'>
          <View className='mt-6'>
            <TextTitle3 label="Kategori" />
            <FlatList
              horizontal={true}
              data={category}
              renderItem={({ item }) => (
                <CategoryCard
                  label={item.categoryName}
                  image={item.categoryImage}
                  onPress={() => {
                    router.replace({
                      pathname: '/bakery' as any,
                    })
                    setLocalStorage('filter', JSON.stringify({ categoryFilter: item.categoryId }));
                  }}
                />
              )}
              keyExtractor={(item) => item.categoryId.toString()}
              className='mt-3'
            />
          </View>

          <View className='mt-6 w-full'>
            <View className='flex-row justify-between items-center w-full'>
              <TextTitle3 label="Rekomendasi untuk Anda" />
              <TextLink label='Lihat semua >' size={10}
                onPress={() => {
                  router.replace({
                    pathname: '/bakery' as any,
                  })
                  setLocalStorage('filter', JSON.stringify({ userLocationFilter: true }));
                }} />
            </View>
            <FlatList
              horizontal={true}
              data={recommendedProducts}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() => {
                    router.push({
                      pathname: '/bakery/bakeryDetail' as any,
                      params: { bakeryId: item.bakery.bakeryId },
                    })
                  }}
                />
              )}
              keyExtractor={(item) => item.productId.toString()}
              className='mt-3'
            />
          </View>

          <View className='mt-5 w-full'>
            <View className='flex-row justify-between items-end w-full'>
              <TextTitle3 label="Dapatkan Sebelum Terlambat" />
              <TextLink label='Lihat semua >' size={10}
                onPress={() => {
                  router.replace({
                    pathname: '/bakery' as any,
                  })
                  setLocalStorage('filter', JSON.stringify({ isExpiringFilter: true }));
                }} />
            </View>
            <FlatList
              horizontal={true}
              data={expiringProducts}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() => {
                    router.push({
                      pathname: '/bakery/bakeryDetail' as any,
                      params: { bakeryId: item.bakery.bakeryId },
                    })
                  }}
                />
              )}
              keyExtractor={(item) => item.productId.toString()}
              className='mt-3'
            />
          </View>
        </View>

      </ScrollView>

    </View>
  );
};

export default Home;
