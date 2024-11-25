import { View, Text, TouchableOpacity, Linking, ScrollView, Image } from 'react-native'
import React, { FC, useState } from 'react'
import { RouteProp } from '@react-navigation/native';
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle5Date from '@/components/texts/TextTitle5Date';
import BackButton from '@/components/BackButton';
import TextTitle5 from '@/components/texts/TextTitle5';
import { convertPhoneNumberFormat, formatDate, formatDatewithtime, formatRupiah, setLocalStorage } from '@/utils/commonFunctions';
import TextTitle4 from '@/components/texts/TextTitle4';
import CustomButton from '@/components/CustomButton';
import ContactButton from '@/components/ContactButton';
import CustomTag from '@/components/CustomTag';
import CustomTagOrderStatus from '@/components/CustomTagOrderStatus';
import RejectOrderButton from '@/components/rejectOrderButton';
import AcceptOrderButton from '@/components/AcceptOrderButton';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import orderSellerApi from '@/api/orderSellerApi';
import { router, useLocalSearchParams } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { OrderDetailType } from '@/types/types';
import TextTitle5Gray from '@/components/texts/TextTitle5Gray';
import ModalInformation from '@/components/ModalInformation';

const OrderDetail = () => {

  const insets = useSafeAreaInsets();

  const { order } = useLocalSearchParams();
  const orderData = order ? JSON.parse(order as string) : null;

  const [isSubmitting, setisSubmitting] = useState(false);
  const [paymentInfoModal, setPaymentInfoModal] = useState(false);

  const handleActionOrder = async (orderStatus: number) => {
    try {
      setisSubmitting(true)
      const response = await orderSellerApi().actionOrder({
        orderId: orderData.orderId,
        orderStatus: orderStatus
      })
      if (response.status === 200) {
        router.push({
          pathname: '/order',
        })
        setLocalStorage('orderSellerParams', JSON.stringify({ status: orderStatus }))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setisSubmitting(false)
    }
  }

  const handleContactBuyer = (phoneNumber: string) => {
    const formattedPhoneNumber = convertPhoneNumberFormat(phoneNumber);
    const url = `https://wa.me/${formattedPhoneNumber}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log('Can\'t handle url: ' + url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  }

  return (
    <View className='bg-background h-full flex-1'>

      <View style={{ height: insets.top }} />

      <ScrollView>
        <View className='mx-5 flex-row items-start'>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '/order',
              })
              setLocalStorage('orderSellerParams', JSON.stringify({ status: orderData.orderStatus }))
            }}
            activeOpacity={0.7}
            style={{ width: 10, height: 24 }}
          >
            <FontAwesome
              name="angle-left"
              size={24}
              color="#000"
            />
          </TouchableOpacity>
          <View className='flex-1 items-center pr-3'>
            <TextTitle3 label={`#${orderData.orderId}`} />
            <TextTitle5Date label={formatDatewithtime(orderData.orderDate)} />
          </View>
        </View>

        <View className='p-5 gap-y-3 mt-5 bg-white'>
          <TextTitle3 label="Data Pembeli" />
          <View className='flex-row justify-between'>
            <TextTitle5 label="Nama Penerima" />
            <TextTitle5 label={orderData.user.userName} />
          </View>
          <View className='flex-row justify-between'>
            <TextTitle5 label="Nomor Telepon" />
            <TextTitle5 label={orderData.user.userPhoneNumber} />
          </View>
        </View>

        <View className='p-5 gap-y-3 mt-5 bg-white'>
          <TextTitle3 label="Ringkasan Pesanan" />
          {orderData.orderDetail.map((item: OrderDetailType) => (
            <View key={item.orderDetailId} className='flex-row justify-between'>
              <View style={{ flexDirection: 'row', columnGap: 8 }}>
                <TextTitle5 label={item.productQuantity} />
                <TextTitle5 label={item.product.productName} />
              </View>
              <TextTitle5 label={formatRupiah(item.totalDetailPrice)} />
            </View>
          ))}
        </View>

        <View className='p-5 mt-5 bg-white'>
          <View className='flex-row justify-between'>
            <TextTitle4 label="Total" />
            <TextTitle5 label={formatRupiah(orderData.totalOrderPrice)} />
          </View>
        </View>

        {
          orderData.orderStatus !== 1 && (
            <View className='p-5 mt-5 bg-white'>
              <View className='flex-row items-center space-x-1'>
                <TextTitle4 label="Bukti Pembayaran" />
                <Ionicons name="information-circle-outline" size={14} color="gray" onPress={() => setPaymentInfoModal(true)} />
              </View>              
              {
                orderData.proofOfPayment ? (
                  <View>
                    <Image
                      source={{ uri: orderData.proofOfPayment }}
                      style={{ width: 150, height: 240, borderRadius: 8, aspectRatio: 9 / 16, resizeMode: 'cover', marginTop: 10 }}
                    />
                  </View>
                ) : (
                  <TextTitle5Gray label="Pembeli belum mengirimkan bukti pembayaran" />
                )
              }
            </View>
          )
        }

        {
          orderData.orderStatus === 1 ? (
            <View className='mx-5 mt-10 mb-5'>
              <CustomButton
                label="Terima Pesanan"
                handlePress={() => handleActionOrder(2)}
                isLoading={isSubmitting}
              />
              <ContactButton
                label="Tolak Pesanan"
                handlePress={() => handleActionOrder(5)}
                buttonStyles='mt-3'
                isLoading={isSubmitting}
              />
            </View>
          ) : orderData.orderStatus === 2 ? (
            <View className='mx-5 mt-10 mb-5'>
              <CustomButton
                label="Konfirmasi Pembayaran"
                handlePress={() => handleActionOrder(3)}
                isLoading={isSubmitting}
              />
              <ContactButton
                label="Hubungi Pembeli"
                handlePress={() => handleContactBuyer(orderData.user.userPhoneNumber)}
                buttonStyles='mt-3'
                isLoading={isSubmitting}
              />
            </View>
          ) : orderData.orderStatus === 3 && (
            <View className='mx-5 mt-10 mb-5'>
              <CustomButton
                label="Selesaikan Pesanan"
                handlePress={() => handleActionOrder(4)}
                isLoading={isSubmitting}
              />
              <ContactButton
                label="Hubungi Pembeli"
                handlePress={() => handleContactBuyer(orderData.user.userPhoneNumber)}
                buttonStyles='mt-3'
                isLoading={isSubmitting}
              />
            </View>
          )
        }

        {
          paymentInfoModal && (
            <ModalInformation
              visible={paymentInfoModal}
              onClose={() => setPaymentInfoModal(false)}
              title='Informasi Pembayaran'
              content='Diharapkan jangan melakukan konfirmasi pembayaran sebelum pembeli mengirimkan bukti pembayaran.'
            />
          )
        }
      </ScrollView>

    </View>

  )
}

export default OrderDetail