import { View, TextInput, TouchableOpacity, Image, Text } from "react-native";
import React, { useState } from "react";
import TextFormLabel from "./texts/TextFormLabel";
import TextTitle5 from "./texts/TextTitle5";
import { icons } from "@/constants/icons";

interface Props {
  label: string;
  image: string;
  onPress: () => void;
}

const CategoryCard: React.FC<Props> = ({ label, image, onPress }) => {
  const getIcon = () => {
    switch (label.toLowerCase()) {
      case "roti":
        return icons.bread;
      case "pasteri":
        return icons.pastry;
      case "kue":
        return icons.cake;
      case "lainnya":
        return icons.others;
      default:
        return icons.others;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-20 h-28 mr-2 flex-col items-center justify-center rounded-lg bg-brown`}
    >
      <Image
        source={getIcon()}
        className="mb-4"
        style={{ width: 50, height: 50, resizeMode: "contain" }}
      />
      <TextTitle5 label={label} color="white" />
    </TouchableOpacity>
  );
};

export default CategoryCard;
