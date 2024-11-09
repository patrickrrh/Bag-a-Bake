import OrderStatusTab from '@/components/OrderStatusTab';
import SearchBar from '@/components/SearchBar';
import TextHeader from '@/components/texts/TextHeader'
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextRating from '@/components/texts/TextRating';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacityBase, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import TextTitle4 from '@/components/texts/TextTitle4';
import OrderCard from '@/components/OrderCard';
import TextTitle5Date from '@/components/texts/TextTitle5Date';
import orderCustomerApi from '@/api/orderCustomerApi';
import { router } from 'expo-router';
import { OrderType } from '@/types/types';

// type Order = {
//   orderId: number;
//   bakeryId: number;
//   orderDate: string;
//   orderStatus: number;
//   orderTotalPrice: number;
// };

const Order = () => {
  const [selectedStatus, setSelectedStatus] = useState(2);
  const [orders, setOrders] = useState<OrderType[]>([]);

  const filteredOrders = orders.filter((order) => order.orderStatus === selectedStatus);

  const handleGetOrderByStatusApi = async () => {
    try {
      const response = await orderCustomerApi().getOrderByStatus({ orderStatus: selectedStatus });
      if (response.status === 200) {
        setOrders(response.data ? response.data : []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetOrderByStatusApi();
  }, [selectedStatus]);

  console.log("Data masuk", orders)

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
              keyExtractor={(item) => item.orderId.toString()}
              renderItem={({ item }) => 
                <OrderCard 
                  order={item} 
                  onPress={() => {
                    router.push({
                      pathname: '/(tabsCustomer)/orderDetail',
                      params: {
                        orderId: item.orderId
                      }
                    })
                  }}
                />}
            />
            </View>
          </View>
      </SafeAreaView>
  )
}

export default Order