import {
  View,
  TextInput,
  Text,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import TextFormLabel from "./texts/TextFormLabel";
import TextTitle4 from "./texts/TextTitle4";
import ErrorMessage from "./texts/ErrorMessage";
import { Ionicons } from "@expo/vector-icons";
import Tooltip from "react-native-walkthrough-tooltip";

interface Props {
  label: string;
  value: string | number;
  placeholder?: string;
  onChangeText: (text: string) => void;
  moreStyles?: string;
  error?: string | null;
}

const formatCurrency = (value: string) => {
  if (!value) return "";
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const PriceInputField: React.FC<Props> = ({
  label,
  value,
  placeholder,
  onChangeText,
  moreStyles,
  error,
}) => {
  const [internalValue, setInternalValue] = useState<string>(
    formatCurrency(String(value))
  );
  const [toolTipVisible, setToolTipVisible] = useState(false);

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

  const [isVisible, setIsVisible] = useState(false);

  return (
    <View className={`space-y-1 ${moreStyles}`}>
      {/* <TextFormLabel label={label} /> */}
      <View className="flex-row items-center space-x-2">
        <TextFormLabel label={label} />
        <Tooltip
          isVisible={isVisible}
          content={
            <Text>Harga Awal merupakan harga produk sebelum diskon</Text>
          }
          placement="right"
          onClose={() => setIsVisible(false)}
          backgroundColor="rgba(0, 0, 0, 0.1)"
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="black"
            onPress={() => setIsVisible(!isVisible)}
          />
        </Tooltip>
      </View>
      <View
        className={`w-full h-[40px] px-4 bg-white rounded-[8px] items-center border ${
          error ? "border-red-500" : "border-gray-200"
        } flex-row`}
      >
        <TextTitle4 label="Rp   " />
        <TextInput
          className="flex-1 text-black text-base"
          style={{ fontFamily: "poppinsRegular", fontSize: 14 }}
          value={internalValue}
          placeholder={placeholder}
          placeholderTextColor={"#828282"}
          onChangeText={handleChangeText}
          keyboardType="numeric"
        />
      </View>
      {error && <ErrorMessage label={error} />}
    </View>
  );
};

export default PriceInputField;
