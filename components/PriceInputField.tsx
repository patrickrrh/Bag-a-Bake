import { View, TextInput, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import TextFormLabel from './texts/TextFormLabel';
import TextTitle4 from './texts/TextTitle4';
import ErrorMessage from './texts/ErrorMessage';

interface Props {
  label: string;
  value: string | number;
  placeholder?: string;
  onChangeText: (text: string) => void;
  moreStyles?: string;
  error?: string | null;
}

const formatCurrency = (value: string) => {
  if (!value) return '';
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); 
};

const PriceInputField: React.FC<Props> = ({ label, value, placeholder, onChangeText, moreStyles, error }) => {
  const [internalValue, setInternalValue] = useState<string>(formatCurrency(String(value)));

  useEffect(() => {
    setInternalValue(formatCurrency(String(value)));
  }, [value]);

  const handleChangeText = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    
    const numberValue = parseInt(numericValue, 10);
    if (numberValue > 1000000) {
      return;
    }

    const formattedValue = formatCurrency(numericValue);
    setInternalValue(formattedValue);
    
    onChangeText(numericValue);
  };

  return (
    <View className={`space-y-1 ${moreStyles}`}>
      <TextFormLabel label={label} />
      <View className={`w-full h-[40px] px-4 bg-white rounded-[8px] items-center border ${error ? 'border-red-500' : 'border-gray-200'} flex-row`}>
        <TextTitle4 label="Rp   " />
        <TextInput
          className='flex-1 text-black text-base'
          style={{ fontFamily: "poppinsRegular", fontSize: 14 }}
          value={internalValue}
          placeholder={placeholder}
          placeholderTextColor={"#828282"}
          onChangeText={handleChangeText}
          keyboardType="numeric" 
        />
      </View>
      {error && (
        <ErrorMessage label={error} />
      )}
    </View>
  );
};

export default PriceInputField;
