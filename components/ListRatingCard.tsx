import React from "react";
import { View, Text, Image } from "react-native";
import TextTitle3 from "./texts/TextTitle3"; // Assuming TextTitle3 is your styled text component
import TextTitle5 from "./texts/TextTitle5";
import TextTitle4 from "./texts/TextTitle4";
import TextTitle5Bold from "./texts/TextTitle5Bold";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";

type Props = {
  item: {
    ratingId: number;
    orderId: number;
    rating: number;
    review: string;
    createdDate: Date;
    order: {
      user: {
        userId: number;
        userName: string;
        userImage: string;
      };
    };
  };
};

const ListRatingCard: React.FC<Props> = ({ item }) => {

  const createdDate = new Date(item.createdDate);
  const formattedDate = createdDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <View className="bg-white rounded-lg shadow-sm mt-4 p-4">
      <View className="flex-row items-center">
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_LOCAL_SERVER}/images/profile/${item.order.user.userImage}` }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 25,
            borderColor: "#000",
            borderWidth: 1,
          }}
        />

        <View className="flex-1 ml-3">
          <View className="flex-row items-center justify-between">
            <TextTitle4 label={item.order.user.userName} />
          </View>

          <TextTitle5 label={formattedDate} />
        </View>
      </View>

      <View className="flex-row space-x-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesome
            key={star}
            name="star"
            size={16}
            color={star <= item.rating ? "#FA6F33" : "rgba(0, 0, 0, 0.1)"}
          />
        ))}
      </View>
      <View className="mt-2">
        <Text className="text-gray-500 text-sm">{item.review}</Text>
      </View>
    </View>
  );
};

export default ListRatingCard;
