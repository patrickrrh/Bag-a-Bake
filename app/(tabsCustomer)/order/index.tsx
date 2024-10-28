import OrderStatusTab from '@/components/OrderStatusTab';
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

const orders = [
    { id: 1, store: 'Berkat Bakery', status: 'Pending', date: '20/12/2023 10:00', items: 2, price: 50000 },
    { id: 2, store: 'Nelnel Bakery', status: 'Pending', date: '20/12/2023 10:00', items: 2, price: 50000 },
    { id: 3, store: 'Berkat Bakery', status: 'Selesai', date: '15/12/2023 11:00', items: 1, price: 40000 },
];

const Order = () => {
  const [selectedStatus, setSelectedStatus] = useState('Pending');

  const filteredOrders = orders.filter((order) => order.status === selectedStatus);

  return (
      <SafeAreaView className="bg-background h-full flex-1">
        <View className="bg-white">
          <View className='mx-5'>
              <TextHeader label="PESANAN SAYA" />
              <View className="mt-6">
                  <OrderStatusTab selectedStatus={selectedStatus} onSelectStatus={setSelectedStatus} />
              </View>
            </View>
        </View>
          <View>
            <View className="mx-5 mt-4">
              <FlatList
                  data={filteredOrders}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View className="bg-white rounded-lg shadow-md mb-4 p-4">
                      <View className="flex-row my-3 items-end justify-between">
                        <View className="flex-row">
                          {/* <Image
                            source={require('../../assets/images/bakery1.png')}
                            style={{ width: 68, height: 68, borderRadius: 10 }}
                          /> */}

                          <View className="ml-4">
                            <TextTitle3 label={item.store} />
                            <TextTitle5Date label={item.date} />

                            {/* <View className="flex-row items-center">
                              <View className='pr-1'>
                                <Image 
                                    source={require('../../assets/images/starFillIcon.png')}
                                    style={{ width: 12, height: 12 }}
                                />
                              </View>
                              <View className='pr-1 pt-1'>
                                <TextRating label={"4.5"} />
                              </View>
                              <View className='pt-1'>
                                <TextTitle5 label={"(20 ulasan)"} />
                              </View>
                            </View> */}

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

export default Order