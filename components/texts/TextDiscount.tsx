import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

interface Props {
    label: string
    size?: number
}

const TextDiscount: React.FC<Props> = ({ label, size }) => {
  return (
    <View className='flex-row items-center gap-x-1'>
      <Ionicons name='pricetag' size={size || 12} color='#FA6F33' />
      <Text
        style={{ fontFamily: "poppinsSemiBold", fontSize: 12 }}
        className='text-orange'
      >
       {`${label}% OFF`}
      </Text>
    </View>
  )
}

export default TextDiscount