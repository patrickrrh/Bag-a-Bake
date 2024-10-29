import ProductStatusTab from '@/components/ProductStatusTab';
import SearchBar from '@/components/SearchBar';
import TextHeader from '@/components/texts/TextHeader'
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextRating from '@/components/texts/TextRating';
import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacityBase, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import TextTitle4 from '@/components/texts/TextTitle4';
import TextTitle5Date from '@/components/texts/TextTitle5Date';
import CustomButton from "@/components/CustomButton";
import { router } from 'expo-router';

const orders = [
    { id: 1, store: 'Berkat Bakery', status: 'Sedang Dijual', date: '20/12/2023 10:00', items: 2, price: 50000 },
    { id: 2, store: 'Nelnel Bakery', status: 'Sedang Dijual', date: '20/12/2023 10:00', items: 2, price: 50000 },
    { id: 3, store: 'Berkat Bakery', status: 'Produk Sebelumnya', date: '15/12/2023 11:00', items: 1, price: 40000 },
];

const ListProduct = () => {
  const [selectedStatus, setSelectedStatus] = useState(1);

  const statusMapping: Record<number, string> = {
    1: 'Sedang Dijual',
    2: 'Produk Sebelumnya',
  };

  const filteredOrders = orders.filter((order) => order.status === statusMapping[selectedStatus]);

  return (
      <SafeAreaView className="bg-background h-full flex-1">
        <View className="bg-white">
          <View className='mx-5'>
              <TextHeader label="DAFTAR PRODUK" />
              <View className="mt-6">
                  <ProductStatusTab selectedStatus={selectedStatus} onSelectStatus={setSelectedStatus} />
              </View>
            </View>
        </View>
        <CustomButton
                label='Tambahkan Produk'
                handlePress={() => {
                  router.push('/product/createProduct')
                }}
                buttonStyles='mt-4'
                isLoading={false} 
            />
          <View>
            <View className="mx-5 mt-4">
              <FlatList
                  data={filteredOrders}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View className="bg-white rounded-lg shadow-md mb-4 p-4">
                      <View className="flex-row my-3 items-end justify-between">
                        <View className="flex-row">
                          {/* Render store and other details */}
                          <View className="ml-4">
                            <TextTitle3 label={item.store} />
                            <TextTitle5Date label={item.date} />
                            <View>
                              <TextTitle5 label={"Jumlah: " + item.items + " item"} />
                            </View>
                          </View>
                        </View>
                        <View className="align-items-end">
                          <TextTitle4 label={item.price.toLocaleString('id-ID') + " IDR"} />
                        </View>
                      </View>
                    </View>
                  )}
              />
            </View>
          </View>
      </SafeAreaView>
  )
}


export default ListProduct