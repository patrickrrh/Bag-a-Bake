import { View, Text, Image, Button, TextInput, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import UploadButton from '@/components/UploadButton';
import { Picker } from '@react-native-picker/picker';
import TextHeader from '@/components/texts/TextHeader';
import OrderStatusTab from '@/components/OrderStatusTab';
import orderSellerApi from '@/api/orderSellerApi';
import SellerOrderCardPending from '@/components/SellerOrderCardPending';
import SellerOrderCard from '@/components/SellerOrderCard';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OrderType } from '@/types/types';
import { getLocalStorage, removeLocalStorage } from '@/utils/commonFunctions';
import LoaderKit from 'react-native-loader-kit'
import { useAuth } from '@/app/context/AuthContext';


const Order = () => {

  const { userData } = useAuth();
  const insets = useSafeAreaInsets();

  const [selectedStatus, setSelectedStatus] = useState(1);
  const hasManualSelection = useRef(false);
  const [order, setOrder] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectStatus = (status: number) => {
    setSelectedStatus(status);
    hasManualSelection.current = true;
  };

  const handleGetAllOrderByStatusApi = async () => {
    setIsLoading(true);
    try {
      const response = await orderSellerApi().getAllOrderByStatus({
        orderStatus: selectedStatus,
        bakeryId: userData?.bakery?.bakeryId
      });
      if (response.status === 200) {
        setOrder(response.data || null);
      }
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const data = await getLocalStorage('orderSellerParams');
        if (data) {
          const parsedData = JSON.parse(data);
          setSelectedStatus(parsedData.status);
        }
      }

      fetchData();
      if (!hasManualSelection.current) {
        handleGetAllOrderByStatusApi();
      }

      return () => {
        removeLocalStorage('orderSellerParams');
      }
    }, [])
  )

  useEffect(() => {
    handleGetAllOrderByStatusApi();
  }, [selectedStatus]);

  const handleActionOrder = async (orderId: number, orderStatus: number) => {
    try {
      const response = await orderSellerApi().actionOrder({
        orderId: orderId,
        orderStatus: orderStatus
      })
      if (response.status === 200) {
        handleGetAllOrderByStatusApi();
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View className='flex-1'>
      <View
        style={{
          backgroundColor: 'white',
          height: insets.top
        }}
      />

      <View className='bg-background h-full flex-1'>
        <View className='bg-white'>
          <View className='mx-5'>
            <TextHeader label="PESANAN" />
            <View className='mt-6'>
              <OrderStatusTab
                selectedStatus={selectedStatus || 1}
                onSelectStatus={handleSelectStatus}
              />
            </View>
          </View>
        </View>

        <View className='flex-1 mx-5'>
          {
            isLoading ? (
              <View className='flex-1 items-center justify-center'>
                <ActivityIndicator size="small" color="#828282" />
              </View>
            ) : (
              <FlatList
                data={order}
                renderItem={({ item }) => (
                  item.orderStatus === 1 ? (
                    <SellerOrderCardPending
                      order={item}
                      onPress={() => {
                        router.push({
                          pathname: '/order/orderDetail',
                          params: { order: JSON.stringify(item) }
                        })
                      }}
                      onAccept={() => handleActionOrder(item.orderId, 2)}
                      onReject={() => handleActionOrder(item.orderId, 4)}
                    />
                  ) : (
                    <SellerOrderCard
                      order={item}
                      onPress={() => {
                        router.push({
                          pathname: '/order/orderDetail',
                          params: { order: JSON.stringify(item) }
                        })
                      }}
                    />
                  )
                )}
                keyExtractor={(item) => item.orderId.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )
          }
        </View>
      </View>
    </View>
  );
};

export default Order;
