import { View, Text, Image, Button, TextInput, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import UploadButton from '@/components/UploadButton';
import { Picker } from '@react-native-picker/picker';
import TabsSellerLayout from './_layout';
import { images } from '@/constants/images';
import TextTitle4 from '@/components/texts/TextTitle4';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import TextTitle5Gray from '@/components/texts/TextTitle5Gray';
import { useAuth } from '../context/AuthContext';
import TextTitle3 from '@/components/texts/TextTitle3';
import TextLink from '@/components/texts/TextLink';
import SellerOrderCard from '@/components/SellerOrderCard';
import SellerOrderCardPending from '@/components/SellerOrderCardPending';
import orderSellerApi from '@/api/orderSellerApi';
import { StackNavigationProp } from '@react-navigation/stack';
import { router, useFocusEffect } from 'expo-router';
import { OrderType } from '@/types/types';
import { setLocalStorage } from '@/utils/commonFunctions';

const Home = () => {

  const { userData } = useAuth();
  const insets = useSafeAreaInsets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [latestPendingOrder, setLatestPendingOrder] = useState<OrderType | null>(null);
  const [latestOngoingOrder, setLatestOngoingOrder] = useState<OrderType | null>(null);
  const [latestPendingOrderCount, setLatestPendingOrderCount] = useState(null);
  const [latestOngoingOrderCount, setLatestOngoingOrderCount] = useState(null);

  const handleGetLatestPendingOrderApi = async () => {
    try {
      const response = await orderSellerApi().getLatestPendingOrder({
        bakeryId: userData?.bakery?.bakeryId
      });
      if (response.status === 200) {
        setLatestPendingOrder(response.data || null);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetLatestOngoingOrderApi = async () => {
    try {
      const response = await orderSellerApi().getLatestOngoingOrder({
        bakeryId: userData?.bakery?.bakeryId
      });
      if (response.status === 200) {
        setLatestOngoingOrder(response.data || null);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCountAllPendingOrderApi = async () => {
    try {
      const response = await orderSellerApi().countAllPendingOrder({
        bakeryId: userData?.bakery?.bakeryId
      });
      if (response.status === 200) {
        setLatestPendingOrderCount(response.data || null);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCountAllOngoingOrderApi = async () => {
    try {
      const response = await orderSellerApi().countAllOngoingOrder({
        bakeryId: userData?.bakery?.bakeryId
      });
      if (response.status === 200) {
        setLatestOngoingOrderCount(response.data || null);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleActionOrder = async (orderStatus: number) => {
    try {
      const response = await orderSellerApi().actionOrder({
        orderId: latestPendingOrder?.orderId,
        orderStatus: orderStatus
      })
      if (response.status === 200) {
        handleGetLatestPendingOrderApi();
        handleGetLatestOngoingOrderApi();
        handleCountAllPendingOrderApi();
        handleCountAllOngoingOrderApi();
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      handleGetLatestPendingOrderApi();
      handleGetLatestOngoingOrderApi();
      handleCountAllPendingOrderApi();
      handleCountAllOngoingOrderApi();
      setRefreshing(false);
    }, 1000);
  }

  useFocusEffect(
    useCallback(() => {
    handleGetLatestPendingOrderApi();
    handleGetLatestOngoingOrderApi();
    handleCountAllPendingOrderApi();
    handleCountAllOngoingOrderApi();
  }, []))

  return (
    <View className="flex-1 px-5 bg-background h-full">

      <View
        style={{
          backgroundColor: '#FEFAF9',
          height: insets.top
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* Header */}
        <View className='flex-row justify-between items-center w-full'>
          <View className='flex-row items-center gap-x-3'>
            <View className="w-10 h-10 border border-gray-200 rounded-full">
              <Image
                source={userData?.userImage ? { uri: userData?.userImage } : images.profile}
                className="w-full h-full rounded-full"
              />
            </View>
            <View className='flex-col'>
              <TextTitle4 label="Halo" />
              <TextTitle5Gray label={userData?.userName || ''} />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => { }}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              borderRadius: 25,
              padding: 8,
            }}
            className='w-10 h-10 justify-center items-center'
          >
            <FontAwesome name="bell" size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <View className='pb-5'>
          <View className='mt-8'>
            <View className='flex-row justify-between items-center w-full'>
              <TextTitle3 label="Pesanan Terbaru" />
              {
                latestPendingOrderCount ? (
                  <TextLink
                    label={`${latestPendingOrderCount} pesanan baru >`}
                    size={10}
                    onPress={() => {
                      router.replace({
                        pathname: '/order',
                      })
                      setLocalStorage("orderSellerParams", JSON.stringify({ status: 1, isFromHomePage: "true" }));
                    }}
                  />
                ) : (null)
              }
            </View>

            {
              latestPendingOrder && Object.keys(latestPendingOrder).length > 0 ? (
                <SellerOrderCardPending
                  order={latestPendingOrder}
                  onPress={() => {
                    router.push({
                      pathname: '/order/orderDetail',
                      params: { order: JSON.stringify(latestPendingOrder) }
                    })
                  }}
                  onReject={() => handleActionOrder(4)}
                  onAccept={() => handleActionOrder(2)}
                />
              ) : (
                <View className='w-full my-5 justify-center items-center'>
                  <TextTitle5Gray label="Tidak ada pesanan masuk saat ini" />
                </View>
              )
            }
          </View>

          <View className='mt-8'>
            <View className='flex-row justify-between items-center w-full'>
              <TextTitle3 label="Pesanan Berlangsung" />
              {
                latestOngoingOrderCount ? (
                  <TextLink
                    label={`${latestOngoingOrderCount} pesanan berlangsung >`}
                    size={10}
                    onPress={() => {
                      router.replace({
                        pathname: '/order',
                      })
                      setLocalStorage("orderSellerParams", JSON.stringify({ status: 2, isFromHomePage: "true" }));
                    }}
                  />
                ) : (null)
              }
            </View>

            {
              latestOngoingOrder && Object.keys(latestOngoingOrder).length > 0 ? (
                <SellerOrderCard
                  order={latestOngoingOrder}
                  onPress={() => {
                    router.push({
                      pathname: '/order/orderDetail',
                      params: { order: JSON.stringify(latestOngoingOrder) }
                    })
                  }}
                />
              ) : (
                <View className='w-full my-5 justify-center items-center'>
                  <TextTitle5Gray label="Tidak ada pesanan yang sedang berlangsung" />
                </View>
              )
            }

          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
