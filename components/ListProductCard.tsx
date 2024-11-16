import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { images } from "@/constants/images";
import TextTitle3 from "./texts/TextTitle3";
import TextTitle5Gray from "./texts/TextTitle5Gray";
import { formatDate, formatRupiah } from "@/utils/commonFunctions";
import CustomTag from "./CustomTag";
import TextTitle4 from "./texts/TextTitle4";

type Props = {
  item: any;
  onPress?: () => void;
};

const ListProductCard: React.FC<Props> = ({ item, onPress }) => {
  const getTodayPrice = () => {
    const today = new Date().toISOString().split('T')[0];
    // console.log("today is", today);
    const todayDiscount = item.discount.find((discount: any) => {
      const discountDate = discount.discountDate.split('T')[0];
      return discountDate === today;
    });
    // console.log(todayDiscount);
    return todayDiscount ? parseFloat(todayDiscount.discountAmount) : item.productPrice;
  };

  const todayPrice = getTodayPrice();

  return (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-sm mt-4 p-4"
      onPress={onPress}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row p-1">
          <Image
            source={images.logo}
            style={{
              width: 68,
              height: 68,
              borderRadius: 10,
              borderColor: "#000",
              borderWidth: 1,
            }}
          />
          <View className="ml-5 space-y-1 flex-1">
            <View className="flex-row justify-between items-center mb-1">
              <TextTitle3 label={item.productName} />
              <CustomTag count={item.productStock} />
            </View>
            <TextTitle5Gray label={formatDate(item.productExpirationDate)} />
            <View className="items-end">
              <TextTitle4 label={formatRupiah(todayPrice)} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListProductCard;
