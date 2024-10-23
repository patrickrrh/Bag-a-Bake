import React, { useEffect, useState } from 'react';
import { View, Text, Image, StatusBar, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants/images';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextTitle5Bold from '@/components/texts/TextTitle5Bold';
import SearchBar from '@/components/SearchBar';
import TextTitle3 from '@/components/texts/TextTitle3';
import categoryApi from '@/api/categoryApi';
import CategoryCard from '@/components/CategoryCard';
import TextLink from '@/components/texts/TextLink';
import { router } from 'expo-router';

type Category = {
  categoryId: number;
  categoryName: string;
  categoryImage: string;
}

const Home = () => {

  const [category, setCategory] = useState<Category[]>([]);

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

  useEffect(() => {
    handleGetCategoryApi();
  }, [])

  return (
    <SafeAreaView>
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
            <View className='flex-row gap-x-2'>
              <Text>map</Text>
              <Text style={{ fontFamily: "poppinsSemiBold", fontSize: 12, color: "white" }}>Lokasi Anda</Text>
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

      <View className='px-5 mt-5'>
        <TextTitle3 label="Kategori" />
        <FlatList 
          horizontal={true}
          data={category}
          renderItem={({ item }) => (
            <CategoryCard 
              label={item.categoryName}
              onPress={() => {
                router.push({
                  pathname: '/(tabsCustomer)/bakery' as any,
                  params: { product: JSON.stringify(item) },
                })
              }}
            />
          )}
          keyExtractor={(item) => item.categoryId.toString()}
          className='mt-2'
        />
      </View>

      <View className='px-5 mt-5 w-full'>
        <View className='flex-row justify-between items-center w-full'>
          <TextTitle3 label="Rekomendasi untuk Anda" />
          <TextLink label='Lihat semua >' size={10} />
        </View>
      </View>

      <View className='px-5 mt-5 w-full'>
        <View className='flex-row justify-between items-center w-full'>
          <TextTitle3 label="Dapatkan sebelum terlambat" />
          <TextLink label='Lihat semua >' size={10} />
        </View>
      </View>

    </SafeAreaView>
  );
};

export default Home;
