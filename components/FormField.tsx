import { View, TextInput, TouchableOpacity, Image, Text } from 'react-native'
import React, { useState } from 'react'
import TextFormLabel from './texts/TextFormLabel'
import { images } from '@/constants/images'
import ErrorMessage from './texts/ErrorMessage';

interface Props {
  label: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  moreStyles?: string;
  keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
  error?: string | null;
}

const FormField: React.FC<Props> = ({ label, placeholder, onChangeText, moreStyles, keyboardType, error }) => {

  const [showPassword, setShowPassword] = useState(false)

  return (
    <View className={`space-y-1 ${moreStyles}`}>
      <TextFormLabel label={label} />
      <View className={`w-full h-[40px] px-4 bg-white rounded-[8px] items-center border ${error ? 'border-red-500' : 'border-gray-200'} focus:border-primary flex-row`}>
        <TextInput
          className='flex-1 text-black text-base'
          style={{ fontFamily: "poppinsRegular" }}
          placeholder={placeholder}
          placeholderTextColor={"#828282"}
          onChangeText={onChangeText}
          secureTextEntry={(label === "Password" || label === "Konfirmasi Password") && !showPassword}
          keyboardType={keyboardType}
        />

        {(label === "Password" || label === "Konfirmasi Password") && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? images.eyeOpen : images.eyeClose}
              className='w-4 h-4'
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <ErrorMessage label={error} />
      )}

    </View>
  )
}

export default FormField