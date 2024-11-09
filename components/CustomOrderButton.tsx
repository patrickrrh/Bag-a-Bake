import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import TextButton from './texts/TextButton';
import TextTitle3 from './texts/TextTitle3';
import TextTitle2 from './texts/TextTitle2';

interface Props {
  label: string;
  price: number; // Pass dynamic price as prop
  handlePress: () => void;
  buttonStyles: string;
  isLoading: boolean;
}

const CustomOrderButton: React.FC<Props> = ({ label, price, handlePress, buttonStyles, isLoading }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-brown rounded-xl min-h-[48px] justify-center items-center ${buttonStyles} ${isLoading ? "opacity-50" : ""}`}
      disabled={isLoading}
    >
        <View className="flex-row justify-center items-center w-full gap-x-1">
            <View className="pt-1">
                <TextTitle3 label={label} color="white" />
            </View>
            <TextTitle2 label={price} />
        </View>

    </TouchableOpacity>
  );
};

export default CustomOrderButton;
