import { View, Text, SafeAreaView } from 'react-native'
import React, { FC } from 'react'
import { RouteProp } from '@react-navigation/native';
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle5Date from '@/components/texts/TextTitle5Date';
import BackButton from '@/components/BackButton';
import TextTitle5 from '@/components/texts/TextTitle5';

interface OrderDetailProps {
  route: RouteProp<{ params: { order: any } }>;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ route }) => {

  const { order } = route.params;

  return (
    <SafeAreaView className='bg-background h-full flex-1'>
      <View className='mx-5 flex-row items-start'>
        <BackButton />
        <View className='flex-1 items-center pr-3'>
          <TextTitle3 label={order.orderId} />
          <TextTitle5Date label={order.orderDate} />
        </View>
      </View>

      <View className='p-5 gap-y-3 mt-10 bg-white'>
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
    </SafeAreaView>
    
  )
}

export default OrderDetail