import { View, Text, TouchableOpacity } from 'react-native'
import React, { FC, useState } from 'react'
import { RouteProp } from '@react-navigation/native';
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle5Date from '@/components/texts/TextTitle5Date';
import BackButton from '@/components/BackButton';
import TextTitle5 from '@/components/texts/TextTitle5';
import { calculateTotalOrderPrice, formatRupiah } from '@/utils/commonFunctions';
import TextTitle4 from '@/components/texts/TextTitle4';
import CustomButton from '@/components/CustomButton';
import ContactButton from '@/components/ContactButton';
import CustomTag from '@/components/CustomTag';
import CustomTagOrderStatus from '@/components/CustomTagOrderStatus';
import RejectOrderButton from '@/components/rejectOrderButton';
import AcceptOrderButton from '@/components/AcceptOrderButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import orderSellerApi from '@/api/orderSellerApi';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';

interface OrderDetailProps {
  route: RouteProp<{ params: { order: any } }>;
  navigation: StackNavigationProp<any>;
}

type OrderDetail = {
  orderDetailId: string;
  productQuantity: string;
  product: any;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ route, navigation }) => {

  const { order } = route.params;

  const [isSubmitting, setisSubmitting] = useState(false);

  const handleActionOrder = async (orderStatus: number) => {
    try {
      setisSubmitting(true)
      const response = await orderSellerApi().actionOrder({
        orderId: order.orderId,
        orderStatus: orderStatus
      })
      if (response.status === 200) {
        navigation.navigate('Order',
          {
            screen: 'OrderScreen',
            params: { status: orderStatus }
          }
        )
      }
    } catch (error) {
      console.log(error)
    } finally {
      setisSubmitting(false)
    }
  }

  return (
    <SafeAreaView className='bg-background h-full flex-1'>

      <View className='mx-5 flex-row items-start'>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Order', {
              screen: 'OrderScreen',
              params: { status: order.orderStatus, isFromHomePage: true }
            })
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
          <TextTitle3 label={`#${order.orderId}`} />
          <TextTitle5Date label={order.orderDate} />
        </View>
      </View>

      <View className='p-5 gap-y-3 mt-5 bg-white'>
        <TextTitle3 label="Data Pembeli" />
        <View className='flex-row justify-between'>
          <TextTitle5 label="Nama Penerima" />
          <TextTitle5 label={order.user.userName} />
        </View>
        <View className='flex-row justify-between'>
          <TextTitle5 label="Nomor Telepon" />
          <TextTitle5 label={order.user.userPhoneNumber} />
        </View>
      </View>

      <View className='p-5 gap-y-3 mt-5 bg-white'>
        <TextTitle3 label="Ringkasan Pesanan" />
        {order.orderDetail.map((item: OrderDetail) => (
          <View key={item.orderDetailId} className='flex-row justify-between'>
            <View style={{ flexDirection: 'row', columnGap: 8 }}>
              <TextTitle5 label={item.productQuantity} />
              <TextTitle5 label={item.product.productName} />
            </View>
            <TextTitle5 label={formatRupiah(item.product.productPrice)} />
          </View>
        ))}
      </View>

      <View className='p-5 mt-5 bg-white'>
        <View className='flex-row justify-between'>
          <TextTitle4 label="Total" />
          <TextTitle5 label={calculateTotalOrderPrice(order.orderDetail)} />
        </View>
      </View>

      {
        order.orderStatus === 1 ? (
          <View className='mx-5 mt-10'>
            <CustomButton
              label="Terima Pesanan"
              handlePress={() => handleActionOrder(2)}
              isLoading={isSubmitting}
            />
            <ContactButton
              label="Tolak Pesanan"
              handlePress={() => handleActionOrder(4)}
              buttonStyles='mt-3'
              isLoading={isSubmitting}
            />
          </View>
        ) : order.orderStatus === 2 ? (
          <View className='mx-5 mt-10'>
            <CustomButton
              label="Selesaikan Pesanan"
              handlePress={() => handleActionOrder(3)}
              isLoading={isSubmitting}
            />
            <ContactButton
              label="Hubungi Pembeli"
              handlePress={() => { }}
              buttonStyles='mt-3'
              isLoading={isSubmitting}
            />
          </View>
        ) : null
      }

    </SafeAreaView>

  )
}

export default OrderDetail