import { View, Text, Image, Button, TextInput, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import UploadButton from '@/components/UploadButton';
import { Picker } from '@react-native-picker/picker';
import { images } from '@/constants/images';
import TextTitle4 from '@/components/texts/TextTitle4';
import { FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import TextTitle5Gray from '@/components/texts/TextTitle5Gray';
import TextTitle3 from '@/components/texts/TextTitle3';
import TextLink from '@/components/texts/TextLink';
import SellerOrderCard from '@/components/SellerOrderCard';
import SellerOrderCardPending from '@/components/SellerOrderCardPending';
import orderSellerApi from '@/api/orderSellerApi';
import { StackNavigationProp } from '@react-navigation/stack';
import { router, useFocusEffect } from 'expo-router';
import { OrderType } from '@/types/types';
import { setLocalStorage } from '@/utils/commonFunctions';
import CustomClickableButton from '@/components/CustomClickableButton';
import TextTitle5 from '@/components/texts/TextTitle5';
import { useAuth } from '@/app/context/AuthContext';
import ModalAction from '@/components/ModalAction';
import { icons } from '@/constants/icons';

const Home = () => {

  const { userData } = useAuth();
  const insets = useSafeAreaInsets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [latestPendingOrder, setLatestPendingOrder] = useState<OrderType | null>(null);
  const [latestPaymentOrder, setLatestPaymentOrder] = useState<OrderType | null>(null);
  const [latestOngoingOrder, setLatestOngoingOrder] = useState<OrderType | null>(null);
  const [latestPendingOrderCount, setLatestPendingOrderCount] = useState(null);
  const [latestPaymentOrderCount, setLatestPaymentOrderCount] = useState(null);
  const [latestOngoingOrderCount, setLatestOngoingOrderCount] = useState(null);

  const [cancelOrderModal, setCancelOrderModal] = useState(false);

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

  const handleGetLatestPaymentOrderApi = async () => {
    try {
      const response = await orderSellerApi().getLatestPaymentOrder({
        bakeryId: userData?.bakery?.bakeryId
      });
      if (response.status === 200) {
        setLatestPaymentOrder(response.data || null);
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

  const handleCountAllPaymentOrderApi = async () => {
    try {
      const response = await orderSellerApi().countAllOnPaymentOrder({
        bakeryId: userData?.bakery?.bakeryId
      });
      if (response.status === 200) {
        setLatestPaymentOrderCount(response.data || null);
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
      const payload: any = {
        orderId: latestPendingOrder?.orderId,
        orderStatus: orderStatus,
      };

      if (orderStatus === 2) {
        payload.paymentStartedAt = new Date().toISOString();
      }

      const response = await orderSellerApi().actionOrder(payload)
      if (response.status === 200) {
        handleGetLatestPendingOrderApi();
        handleGetLatestPaymentOrderApi();
        handleGetLatestOngoingOrderApi();
        handleCountAllPendingOrderApi();
        handleCountAllPaymentOrderApi();
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
      handleGetLatestPaymentOrderApi();
      handleGetLatestOngoingOrderApi();
      handleCountAllPendingOrderApi();
      handleCountAllPaymentOrderApi();
      handleCountAllOngoingOrderApi();
      setRefreshing(false);
    }, 1000);
  }

  useFocusEffect(
    useCallback(() => {
      handleGetLatestPendingOrderApi();
      handleGetLatestPaymentOrderApi();
      handleGetLatestOngoingOrderApi();
      handleCountAllPendingOrderApi();
      handleCountAllPaymentOrderApi();
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
        <View className="flex-row justify-between items-center w-full">
          <TouchableOpacity
            onPress={() => router.replace("/profilePageSeller" as any)}
            className="flex-row items-center gap-x-3"
          >
            <View className="w-10 h-10 border border-gray-200 rounded-full">
            <Image
                source={userData?.userImage ? { uri: `${process.env.EXPO_PUBLIC_LOCAL_SERVER}/images/profile/${userData?.userImage}` } : images.profile}
                className="w-full h-full rounded-full"
              />
            </View>
            <View className="flex-col">
              <TextTitle4 label="Halo" />
              <TextTitle5Gray label={userData?.userName || ""} />
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center gap-x-1">
            {userData?.bakery.isHalal && (
              <Image source={icons.halalLogo} className="w-10 h-10" />
            )}
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/ratingBakerySeller" as any,
                  params: {
                    bakeryId: userData?.bakery?.bakeryId,
                    bakeryName: userData?.bakery.bakeryName as string,
                  },
                });
              }}
              className="justify-center items-center px-2 py-1 rounded border border-orange"
            >
              <View className="flex-row items-center">
                <View className="mr-2" style={{ paddingVertical: 2 }}>
                  <FontAwesome name="star" size={14} color="#FA6F33" />
                </View>
                <TextTitle5 label="Penilaian Bakeri" color="#FA6F33" />
              </View>
            </TouchableOpacity>
          </View>
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
                  onReject={() => { setCancelOrderModal(true); }}
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
              <TextTitle3 label="Menunggu Pembayaran" />
              {
                latestPaymentOrderCount ? (
                  <TextLink
                    label={`${latestPaymentOrderCount} menunggu pembayaran >`}
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
              latestPaymentOrder && Object.keys(latestPaymentOrder).length > 0 ? (
                <SellerOrderCard
                  order={latestPaymentOrder}
                  onPress={() => {
                    router.push({
                      pathname: '/order/orderDetail',
                      params: { order: JSON.stringify(latestPaymentOrder) }
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

      <ModalAction
        modalVisible={cancelOrderModal}
        setModalVisible={setCancelOrderModal}
        title="Apakah Anda yakin ingin membatalkan pesanan ini?"
        primaryButtonLabel="Kembali"
        secondaryButtonLabel="Batalkan Pesanan"
        onPrimaryAction={() => setCancelOrderModal(false)}
        onSecondaryAction={() => handleActionOrder(5)}
      />

    </View>
  );
};

export default Home;
