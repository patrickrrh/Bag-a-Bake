import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

interface Props {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const RatingInput: React.FC<Props> = ({ rating, onRatingChange }) => {
  return (
    <View className="flex-row space-x-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => onRatingChange(item)}
          className="p-1"
        >
          <FontAwesome
            name="star"
            size={24}
            color={item <= rating ? "#FA6F33" : "rgba(0, 0, 0, 0.1)"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RatingInput;
