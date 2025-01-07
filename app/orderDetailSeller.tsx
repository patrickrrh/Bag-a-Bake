import { View, Text, TouchableOpacity, Linking, ScrollView, Image } from 'react-native'
import React, { FC, useState } from 'react'
import { RouteProp } from '@react-navigation/native';
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle5Date from '@/components/texts/TextTitle5Date';
import BackButton from '@/components/BackButton';
import TextTitle5 from '@/components/texts/TextTitle5';
import { calculateValidPaymentTime, convertPhoneNumberFormat, formatDate, formatDatewithtime, formatRupiah, setLocalStorage } from '@/utils/commonFunctions';
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
import { OrderDetailType, OrderType } from '@/types/types';
import TextTitle5Gray from '@/components/texts/TextTitle5Gray';
import ModalInformation from '@/components/ModalInformation';
import CustomClickableButton from '@/components/CustomClickableButton';
import TextDiscount from '@/components/texts/TextDiscount';
import ImageView from "react-native-image-viewing";
import { handleDownloadImage } from '@/utils/mediaUtils';
import Toast from 'react-native-toast-message';
import ModalAction from '@/components/ModalAction';
import TextTitle5Bold from '@/components/texts/TextTitle5Bold';
import { generateInvoice, printPDF } from '@/utils/printUtils';
import { useAuth } from '@/app/context/AuthContext';
import FilterButton from '@/components/FilterButton';
import { showToast } from '@/utils/toastUtils';

const OrderDetailSeller = () => {

  const { userData } = useAuth();
  const insets = useSafeAreaInsets();

  const { order } = useLocalSearchParams();
  const orderData = order ? JSON.parse(order as string) : null;

  const [isSubmitting, setisSubmitting] = useState(false);
  const [paymentInfoModal, setPaymentInfoModal] = useState(false);
  const [isPreviewPayment, setIsPreviewPayment] = useState(false);
  const [cancelOrderModal, setCancelOrderModal] = useState(false);
  const [rejectOrderModal, setRejectOrderModal] = useState(false);

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
        if (orderStatus === 2) {
          showToast('success', 'Pesanan telah diterima');
        } else if (orderStatus === 3) {
          showToast('success', 'Pembayaran telah dikonfirmasi');
        } else if (orderStatus === 4) {
          showToast('success', 'Pesanan telah diselesaikan');
        }
        router.replace({
          pathname: '/(tabsSeller)/order',
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
      setisSubmitting(true);

      const response = await orderSellerApi().cancelOrder({
        orderId: orderData.orderId
      })
      if (response.status === 200) {
        showToast('success', 'Pesanan telah dibatalkan');
        router.replace({
          pathname: '/(tabsSeller)/order',
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

  const handlePrintPDF = async (orderItem: OrderType) => {
    const invoiceHtml = generateInvoice(orderItem, userData);

    try {
      await printPDF(invoiceHtml, `${userData?.bakery.bakeryName}_Invoice_Order${orderItem.orderId}_${formatDate(orderItem.orderDate)}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className='bg-background h-full flex-1'>

      <View style={{ height: insets.top }} />

      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <Toast topOffset={50} />
      </View>

      <View className="mx-5 mb-5 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => {
            router.replace({
              pathname: '/(tabsSeller)/order',
            });
            setLocalStorage('orderSellerParams', JSON.stringify({ status: orderData.orderStatus }));
          }}
          activeOpacity={0.7}
          style={{ width: 10, height: 24 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome name="angle-left" size={24} color="#000" />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <TextTitle3 label={`#${orderData.orderId}`} />
          <TextTitle5Date label={formatDatewithtime(orderData.orderDate)} />
        </View>

        {orderData.orderStatus === 4 ? (
          <TouchableOpacity onPress={() => handlePrintPDF(orderData)} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={20} color="#B0795A" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
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
                <TextTitle5 label={`${item.productQuantity}x`} />
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
                          source={{ uri: `${process.env.EXPO_PUBLIC_LOCAL_SERVER}/images/proof-of-payment/${orderData.proofOfPayment}` }}
                          style={{ width: 150, height: 240, borderRadius: 8, aspectRatio: 9 / 16, resizeMode: 'cover', marginTop: 10 }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDownloadImage('images/proof-of-payment', orderData.proofOfPayment)} className='ml-1'>
                        <Ionicons name="download-outline" size={18} color="gray" />
                      </TouchableOpacity>
                    </View>
                    <ImageView
                      images={[{ uri: `${process.env.EXPO_PUBLIC_LOCAL_SERVER}/images/proof-of-payment/${orderData.proofOfPayment}` }]}
                      imageIndex={0}
                      visible={isPreviewPayment}
                      onRequestClose={() => setIsPreviewPayment(false)}
                    />
                  </View>
                ) : (
                  <View className='flex-row mt-3'>
                    <View className='mr-1'>
                      <TextTitle5Gray label={`Pembeli harus membayar sebelum`} />
                    </View>
                    <TextTitle5Bold label={calculateValidPaymentTime(orderData.paymentStartedAt)} color='#FA6F33' />
                  </View>
                )
              }
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

        <ModalAction
          modalVisible={cancelOrderModal}
          setModalVisible={setCancelOrderModal}
          title="Apakah Anda yakin ingin membatalkan pesanan ini?"
          primaryButtonLabel="Kembali"
          secondaryButtonLabel="Batalkan Pesanan"
          onPrimaryAction={() => { setCancelOrderModal(false) }}
          onSecondaryAction={() => {
            handleCancelOrder();
          }}
        />

        <ModalAction
          modalVisible={rejectOrderModal}
          setModalVisible={setRejectOrderModal}
          title="Apakah Anda yakin ingin menolak pesanan ini?"
          primaryButtonLabel="Kembali"
          secondaryButtonLabel="Tolak Pesanan"
          onPrimaryAction={() => { setRejectOrderModal(false) }}
          onSecondaryAction={() => {
            handleCancelOrder();
          }}
        />
      </ScrollView>

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
              handlePress={() => setRejectOrderModal(true)}
              buttonStyles='mt-3'
              isLoading={isSubmitting}
            />
          </View>
        ) : (orderData.orderStatus === 2 && orderData.proofOfPayment) ? (
          <View className='mx-5 my-5'>
            <CustomButton
              label="Konfirmasi Pembayaran"
              handlePress={() => handleActionOrder(3)}
              isLoading={isSubmitting}
            />
            <ContactButton
              label="Batalkan Pesanan"
              handlePress={() => setCancelOrderModal(true)}
              buttonStyles='mt-3'
              isLoading={isSubmitting}
            />
          </View>
        ) : orderData.orderStatus === 3 && (
          <View className='mx-5 my-5'>
            <CustomButton
              label="Selesaikan Pesanan"
              handlePress={() => handleActionOrder(4)}
              isLoading={isSubmitting}
            />
          </View>
        )
      }

    </View>

  )
}

export default OrderDetailSeller