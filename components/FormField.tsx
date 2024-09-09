import { View, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import TextFormLabel from './texts/TextFormLabel'
import { images } from '@/constants/images'

interface Props {
    label: string;
    value: string;
    placeholder?: string;
    onChangeText: (text: string) => void;
    moreStyles?: string;
    keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
}

const FormField: React.FC<Props> = ({ label, value, placeholder, onChangeText, moreStyles, keyboardType }) => {

    const [showPassword, setShowPassword] = useState(false)

  return (
    <View className={`space-y-1 ${moreStyles}`}>
      <TextFormLabel label={label} />
      <View className='w-full h-[40px] px-4 bg-white rounded-[8px] items-center border border-gray-200 focus:border-primary flex-row'>
        <TextInput
            className='flex-1 text-black text-base'
            style={{ fontFamily: "poppinsRegular" }}
            placeholder={placeholder}
            placeholderTextColor={"#828282"}
            onChangeText={onChangeText}
            secureTextEntry={label === "Password" && !showPassword}
            keyboardType={keyboardType}
        />

        {label === "Password" && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image 
                    source={!showPassword ? images.eyeOpen : images.eyeClose}
                    className='w-4 h-4'
                    resizeMode="contain"
                />
            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField