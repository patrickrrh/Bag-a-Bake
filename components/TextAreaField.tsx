import { View, TextInput, TouchableOpacity, Image, Text } from 'react-native'
import React, { useState } from 'react'
import TextFormLabel from './texts/TextFormLabel'
import { images } from '@/constants/images'
import ErrorMessage from './texts/ErrorMessage';

interface Props {
  label: string;
  value: string | number;
  placeholder?: string;
  onChangeText: (text: string) => void;
  moreStyles?: string;
  keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
  error?: string | null;
}

const TexrAreaField: React.FC<Props> = ({ label, value, placeholder, onChangeText, moreStyles, keyboardType, error }) => {

  return (
    <View className={`space-y-1 ${moreStyles}`}>
      <TextFormLabel label={label} />
      <View className={`w-full px-4 bg-white rounded-[8px] items-center border ${error ? 'border-red-500' : 'border-gray-200'} focus:border-primary flex-row`}>
        <TextInput
          className='flex-1 text-black text-base pt-2'
          style={{ fontFamily: "poppinsRegular" }}
          value={value as any}
          placeholder={placeholder}
          placeholderTextColor={"#828282"}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={true}
          numberOfLines={5}
          textAlignVertical='top'
        />

      </View>
      {error && (
        <ErrorMessage label={error} />
      )}

    </View>
  )
}

export default TexrAreaField