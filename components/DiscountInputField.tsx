import { View, TextInput, Text } from "react-native";
import React, { useState, useEffect } from "react";
import TextTitle4 from "./texts/TextTitle4";

interface Props {
  value: string | number;
  placeholder?: string;
  onChangeText: (text: string) => void;
  moreStyles?: string;
  editable?: boolean;
  error?: string | null;
}

const formatCurrency = (value: string) => {
  if (!value) return "";
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const DiscountInputField: React.FC<Props> = ({
  value,
  placeholder,
  onChangeText,
  moreStyles,
  editable = true,
  error,
}) => {
  const [internalValue, setInternalValue] = useState<string>(
    formatCurrency(String(value))
  );

  useEffect(() => {
    setInternalValue(formatCurrency(String(value)));
  }, [value]);

  const handleChangeText = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");

    const numberValue = parseInt(numericValue, 10);
    if (numberValue > 1000000) {
      return;
    }

    const formattedValue = formatCurrency(numericValue);
    setInternalValue(formattedValue);

    onChangeText(numericValue);
  };

  const inputStyle = {
    opacity: editable ? 1 : 0.5,
  };

  const textColor = editable ? "black" : "#b0b0b0";

  return (
    <View className={`space-y-1 ${moreStyles}`}>
      <View
        className={`w-[160px] h-[46px] px-4 bg-white rounded-[8px] border ${
          error ? "border-red-500" : "border-gray-200"
        } flex-row items-center`}
      >
        <Text
          style={{ fontFamily: "poppinsSemiBold", fontSize: 14, color: textColor }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {"Rp" + "\u00A0\u00A0\u00A0"}
        </Text>

        <TextInput
          className="flex-1 text-black"
          style={[{ fontFamily: "poppinsRegular", fontSize: 14 }, inputStyle]}
          value={internalValue}
          placeholder={placeholder}
          placeholderTextColor={"#828282"}
          onChangeText={handleChangeText}
          keyboardType="numeric"
          editable={editable}
        />
      </View>
      {error && <Text className="text-red-500">{error}</Text>}
    </View>
  );
};

export default DiscountInputField;
