import React, { useEffect, useState } from 'react';
import { View, Text, Image, StatusBar, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants/images';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextTitle5Bold from '@/components/texts/TextTitle5Bold';
import SearchBar from '@/components/SearchBar';
import TextTitle3 from '@/components/texts/TextTitle3';
import categoryApi from '@/api/categoryApi';
import productApi from '@/api/productApi';
import CategoryCard from '@/components/CategoryCard';
import TextLink from '@/components/texts/TextLink';
import { router } from 'expo-router';
import ProductCard from '@/components/ProductCard';
import { icons } from '@/constants/icons';
import { useAuth } from '../context/AuthContext';
import CustomButton from '@/components/CustomButton';

type Category = {
  categoryId: number;
  categoryName: string;
  categoryImage: string;
}

type Product = {
  bakeryId: number;
  categoryId: number;
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  productPrice: string;
  productStock: number;
  productExpirationDate: string;
  isActive: number;
}

const Home = () => {

  const { userData, signOut } = useAuth();
  const [category, setCategory] = useState<Category[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [expiringProducts, setExpiringProducts] = useState<Product[]>([]);
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
        regionId: userData?.regionId,
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
      const response = await productApi().getExpiringProducts();
      if (response.status === 200) {
        setExpiringProducts(response.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetCategoryApi();
    handleGetRecommendedProducts();
    handleGetExpiringProducts();
  }, [])

  return (
    <SafeAreaView className='bg-brown flex-1'>
      <ScrollView className='bg-background'>
        {/* <StatusBar backgroundColor="#B0795A" barStyle="light-content" /> */}

        {/* Header */}
        <View
          className='bg-brown px-5 pb-8'
          style={{
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          <View className='flex-row justify-between items-center w-full mb-7'>
            <View className="w-10 h-10 border border-gray-200 rounded-full">
              <Image
                source={images.profile}
                className="w-full h-full rounded-full"
              />
            </View>
            <View className='flex-col items-center gap-y-1'>
              <Text style={{ fontFamily: "poppinsLight", fontSize: 12, color: "white" }}>Lokasi Anda</Text>
              <View className='flex-row gap-x-1'>
                <Image
                  source={icons.location}
                  style={{ width: 12, height: 12, marginRight: 5, tintColor: "white" }}
                />
                <Text style={{ fontFamily: "poppinsSemiBold", fontSize: 12, color: "white" }}>{userData?.regionUser.regionName}</Text>
              </View>
            </View>
            <View className="w-10 h-10 border border-gray-200 rounded-full">
              {/* sementara buat icon notif */}
            </View>
          </View>
          <SearchBar
            value='Sementara'
            placeholder='Telusuri roti, pasteri, kue dan lainnya...'
            onChange={() => { }}
          />
        </View>

        <View className='px-5 mt-6'>
          <TextTitle3 label="Kategori" />
          <FlatList
            horizontal={true}
            data={category}
            renderItem={({ item }) => (
              <CategoryCard
                label={item.categoryName}
                image={item.categoryImage}
                onPress={() => {
                  router.push({
                    pathname: '/(tabsCustomer)/bakery' as any,
                    params: { product: JSON.stringify(item) },
                  })
                }}
              />
            )}
            keyExtractor={(item) => item.categoryId.toString()}
            className='mt-3'
          />
        </View>

        <View className='px-5 mt-6 w-full'>
          <View className='flex-row justify-between items-center w-full'>
            <TextTitle3 label="Rekomendasi untuk Anda" />
            <TextLink label='Lihat semua >' size={10} />
          </View>
          <FlatList
            horizontal={true}
            data={recommendedProducts}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => {
                  router.push({
                    pathname: '/(tabsCustomer)/bakeryDetail' as any,
                    params: { productId: item.productId },
                  })
                }}
              />
            )}
            keyExtractor={(item) => item.productId.toString()}
            className='mt-3'
          />
        </View>

        <View className='px-5 mt-5 w-full'>
          <View className='flex-row justify-between items-center w-full'>
            <TextTitle3 label="Dapatkan Sebelum Terlambat" />
            <TextLink label='Lihat semua >' size={10} />
          </View>
          <FlatList
            horizontal={true}
            data={expiringProducts}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => { }}
              />
            )}
            keyExtractor={(item) => item.productId.toString()}
            className='mt-3'
          />
        </View>

        <CustomButton
          label='logout sementara'
          handlePress={() => signOut()}
          buttonStyles='mt-4'
          isLoading={isSubmitting}
        />


      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
