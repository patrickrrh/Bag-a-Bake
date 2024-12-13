import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle4 from '@/components/texts/TextTitle4';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextRating from '@/components/texts/TextRating';
import { images } from '@/constants/images';
import TextTitle5Gray from './texts/TextTitle5Gray';
import { icons } from '@/constants/icons';
import { formatDate, formatRupiah } from '@/utils/commonFunctions';
import CustomTagOrderStatus from './CustomTagOrderStatus';

type Props = {
  item: any;
  onPress?: () => void;
};

const OrderCard: React.FC<Props> = ({ item, onPress }) => {

  return (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-sm mt-4 p-4"
      onPress={onPress}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row p-1">
          <Image
            source={{ uri: `${process.env.EXPO_PUBLIC_LOCAL_SERVER}/images/bakery-picture/${item.bakery.bakeryImage}` }}
            style={{ width: 68, height: 68, borderRadius: 10, borderColor: '#000', borderWidth: 1 }}
          />
          <View className="ml-5 space-y-3 flex-1">
            <View className='flex-row items-center justify-between mb-1'>
              <TextTitle3 label={item.bakery.bakeryName} />
              <TextTitle5Gray label={formatDate(item.orderDate)} />
            </View>
            <TextRating rating={item.prevRating.averageRating} reviewCount={item.prevRating.reviewCount} containerStyle='mb-1' />
            <TextTitle5 label={`Jumlah: ${item.totalOrderQuantity} item`} />
            {
              item.orderStatus === 5 ? (
                <View className="flex-row justify-between items-center">
                  <CustomTagOrderStatus status={item.orderStatus} />
                  <TextTitle4 label={formatRupiah(item.totalOrderPrice)} />
                </View>
              ) : (
                <View className='items-end'>
                  <TextTitle4 label={formatRupiah(item.totalOrderPrice)} />
                </View>
              )
            }
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;
