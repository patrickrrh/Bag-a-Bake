import { View, TextInput, Text } from 'react-native';
import React, { useState, useEffect } from 'react';

interface Props {
  value: string | number;
  placeholder?: string;
  onChangeText: (text: string) => void;
  moreStyles?: string;
  error?: string | null;
}

const DiscountInputField: React.FC<Props> = ({ value, placeholder, onChangeText, moreStyles, error }) => {
  const [internalValue, setInternalValue] = useState<string>(String(value));

  useEffect(() => {
    setInternalValue(String(value));
  }, [value]);

  const handleChangeText = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');

    const numberValue = parseInt(numericValue, 10);

    if (numericValue && (numberValue < 1 || numberValue > 99)) {
      return; 
    }

    setInternalValue(numericValue);
    onChangeText(numericValue);
  };

  return (
    <View className={`space-y-1 ${moreStyles}`}>
      <View className={`w-[160px] h-[40px] px-4 bg-white rounded-[8px] border ${error ? 'border-red-500' : 'border-gray-200'} flex-row items-center`}>
        <TextInput
          className='flex-1 text-black text-base'
          style={{ fontFamily: "poppinsRegular", fontSize: 14 }}
          value={internalValue}
          placeholder={placeholder}
          placeholderTextColor={"#828282"}
          onChangeText={handleChangeText}
          keyboardType="numeric"
        />
        <Text className="text-gray-700">%</Text>
      </View>
      {error && (
        <Text className="text-red-500">{error}</Text>
      )}
    </View>
  );
};

export default DiscountInputField;
