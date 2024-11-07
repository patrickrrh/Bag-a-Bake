import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle4 from '@/components/texts/TextTitle4';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextRating from '@/components/texts/TextRating';
import { useNavigation } from '@react-navigation/native';

type OrderCardProps = {
  order: {
    orderId: number;
    bakery: { bakeryName: string };
    totalQuantity: number;
    totalOrderPrice: number;
  };
  onPress?: () => void;
};

const OrderCard = ({ order, onPress }: OrderCardProps) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={onPress} className="bg-white rounded-lg shadow-md mb-4 p-4">
      <View className="flex-row my-3 items-end justify-between">
        <View className="flex-row">
          <Image
            source={require('../assets/images/bakery1.png')}
            style={{ width: 68, height: 68, borderRadius: 10 }}
          />
          <View className="ml-4">
            <TextTitle3 label={order.bakery.bakeryName} />
            <View className="flex-row items-center">
              <Image 
                source={require('../assets/images/starFillIcon.png')}
                style={{ width: 12, height: 12 }}
              />
              <View className="ml-1 mr-1">
                <TextRating label="4.5" />
              </View>
              <TextTitle5 label="(20 ulasan)" />
            </View>
            <TextTitle5 label={`Jumlah: ${order.totalQuantity} item`} />
          </View>
        </View>
        <TextTitle4 label={`Rp ${order.totalOrderPrice.toLocaleString('id-ID')}`} />
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;
