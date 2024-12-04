import { View, TextInput, TouchableOpacity, Image, Text, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import TextFormLabel from './texts/TextFormLabel'
import { images } from '@/constants/images'
import ErrorMessage from './texts/ErrorMessage';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  value: string | number;
  placeholder?: string;
  onChangeText: (text: string) => void;
  moreStyles?: string;
  keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
  error?: string | null;
}

const FormField: React.FC<Props> = ({ label, value, placeholder, onChangeText, moreStyles, keyboardType, error }) => {

  const [showPassword, setShowPassword] = useState(false)

  const handleTextChange = (text: string) => {
    if (
      label === "Kata Sandi" || 
      label === "Konfirmasi Kata Sandi" || 
      label === "Kata Sandi Lama" || 
      label === "Kata Sandi Baru" || 
      label === "Konfirmasi Kata Sandi Baru"
    ) {
      onChangeText(text.replace(/\s+/g, ''));
    } else {
      onChangeText(text);
    }
  };

  return (
    <View className={`space-y-1 ${moreStyles}`}>
      <TextFormLabel label={label} />
      <View className={`w-full h-[46px] px-4 bg-white rounded-[8px] justify-center items-center border ${error ? 'border-red-500' : 'border-gray-200'} focus:border-primary flex-row`}>
        <TextInput
          className='flex-1 text-black'
          style={{ fontFamily: "poppinsRegular", fontSize: 14 }}
          value={value as any}
          placeholder={placeholder}
          placeholderTextColor={"#828282"}
          onChangeText={handleTextChange}
          secureTextEntry={(label === "Kata Sandi" || label === "Konfirmasi Kata Sandi" || label === "Kata Sandi Lama" || label === "Kata Sandi Baru" || label === "Konfirmasi Kata Sandi Baru") && !showPassword}
          keyboardType={keyboardType}
          textAlignVertical='center'
        />

        {(label === "Kata Sandi" || label === "Konfirmasi Kata Sandi" || label === "Kata Sandi Lama" || label === "Kata Sandi Baru" || label === "Konfirmasi Kata Sandi Baru") && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {
              showPassword ? (
                <Ionicons name="eye-off" size={14} color="black" />
              ) : (
                <Ionicons name="eye" size={14} color="black" />
              )
            }
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