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
import CustomClickableButton from '@/components/CustomClickableButton';
import TextDiscount from '@/components/texts/TextDiscount';
import ImageView from "react-native-image-viewing";
import { handleDownloadImage } from '@/utils/mediaUtils';
import Toast from 'react-native-toast-message';

const OrderDetail = () => {

  const insets = useSafeAreaInsets();

  const { order } = useLocalSearchParams();
  const orderData = order ? JSON.parse(order as string) : null;

  const [isSubmitting, setisSubmitting] = useState(false);
  const [paymentInfoModal, setPaymentInfoModal] = useState(false);
  const [isPreviewPayment, setIsPreviewPayment] = useState(false);

  const handleActionOrder = async (orderStatus: number) => {
    try {
      setisSubmitting(true)

      const payload: any = {
        orderId: orderData.orderId,
        orderStatus: orderStatus,
      };

      if (orderStatus === 2) {
        payload.paymentStartedAt = new Date().toISOString();
      }

      const response = await orderSellerApi().actionOrder(payload)
      if (response.status === 200) {
        router.replace({
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

  const handleCancelOrder = async () => {
    try {
      setisSubmitting(true)

      const response = await orderSellerApi().cancelOrder({
        orderId: orderData.orderId
      })
      if (response.status === 200) {
        router.replace({
          pathname: '/order',
        })
        setLocalStorage('orderSellerParams', JSON.stringify({ status: 4 }))
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

  console.log("odrere data", JSON.stringify(orderData, null, 2))

  return (
    <View className='bg-background h-full flex-1'>

      <View style={{ height: insets.top }} />

      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <Toast topOffset={50} />
      </View>

      <View className='mx-5 mb-5 flex-row items-start'>
          <TouchableOpacity
            onPress={() => {
              router.replace({
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

      <ScrollView>

        <View className='p-5 gap-y-3 bg-white'>
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

        <View className='p-5 gap-y-3 mt-5 bg-white'>
          <TextTitle3 label="Ringkasan Pesanan" />
          {orderData.orderDetail.map((item: OrderDetailType) => (
            <View key={item.orderDetailId} className='flex-row justify-between'>
              <View style={{ flexDirection: 'row', columnGap: 8 }}>
                <TextTitle5 label={item.productQuantity} />
                <TextTitle5 label={item.product.productName} />
              </View>
              <View className='flex-col items-end'>
                <View className='flex-row'>
                  <View className='mr-1'>
                    <TextTitle5 label={formatRupiah(Number(item.product.productPrice) * item.productQuantity)} textStyle={{ textDecorationLine: 'line-through' }} />
                  </View>
                  <TextDiscount label={item.discountPercentage} />
                </View>
                <TextTitle5 label={formatRupiah(item.totalDetailPrice)} />
              </View>
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
              <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center space-x-1'>
                  <TextTitle4 label="Bukti Pembayaran" />
                  <Ionicons name="information-circle-outline" size={14} color="gray" onPress={() => setPaymentInfoModal(true)} />
                </View>
                <CustomClickableButton
                  label={"Hubungi Pembeli"}
                  handlePress={() => handleContactBuyer(orderData.user.userPhoneNumber)}
                  isLoading={isSubmitting}
                  icon="whatsapp"
                  iconColor='#25D366'
                />
              </View>
              {
                orderData.proofOfPayment ? (
                  <View>
                    <View className='flex-row items-end'>
                      <TouchableOpacity onPress={() => setIsPreviewPayment(true)}>
                        <Image
                          source={{ uri: encodeURI(orderData.proofOfPayment) }}
                          style={{ width: 150, height: 240, borderRadius: 8, aspectRatio: 9 / 16, resizeMode: 'cover', marginTop: 10 }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDownloadImage(orderData.proofOfPayment)} className='ml-1'>
                        <Ionicons name="download-outline" size={18} color="gray" />
                      </TouchableOpacity>
                    </View>
                    <ImageView
                      images={[{ uri: encodeURI(orderData.proofOfPayment) }]}
                      imageIndex={0}
                      visible={isPreviewPayment}
                      onRequestClose={() => setIsPreviewPayment(false)}
                    />
                  </View>
                ) : (
                  <View style={{ marginTop: 10 }}>
                    <TextTitle5Gray label="Pembeli belum mengirimkan bukti pembayaran" />
                  </View>
                )
              }
            </View>
          )
        }

        {
          orderData.orderStatus === 1 ? (
            <View className='mx-5 my-5'>
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
            <View className='mx-5 my-5'>
              <CustomButton
                label="Konfirmasi Pembayaran"
                handlePress={() => handleActionOrder(3)}
                isLoading={isSubmitting}
              />
              {
                orderData.proofOfPayment && (
                  <ContactButton
                    label="Batalkan Pesanan"
                    handlePress={() => handleCancelOrder()}
                    buttonStyles='mt-3'
                    isLoading={isSubmitting}
                  />
                )
              }
            </View>
          ) : orderData.orderStatus === 3 && (
            <View className='mx-5 my-5'>
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