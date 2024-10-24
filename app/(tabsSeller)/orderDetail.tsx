import { View, Text, SafeAreaView } from 'react-native'
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

interface OrderDetailProps {
  route: RouteProp<{ params: { order: any } }>;
}

type OrderDetail = {
  orderDetailId: string;
  productQuantity: string;
  product: any;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ route }) => {

  const { order } = route.params;

  const [isSubmitting, setisSubmitting] = useState(false);

  console.log("order", order)

  return (
    <SafeAreaView className='bg-background h-full flex-1'>
      <View className='mx-5 flex-row items-start'>
        <BackButton />
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
          <View className='flex-row mt-10 mx-5'>
            <RejectOrderButton
              label='Tolak'
              onPress={() => { }}
              isLoading={false}
            />
            <AcceptOrderButton
              label='Terima'
              onPress={() => { }}
              isLoading={false}
            />
          </View>
        ) : order.orderStatus === 2 ? (
          <View className='mx-5 mt-10'>
            <CustomButton
              label="Selesaikan Pesanan"
              handlePress={() => { }}
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