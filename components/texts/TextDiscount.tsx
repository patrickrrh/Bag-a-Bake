import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
    size?: number
}

const TextDiscount: React.FC<Props> = ({ label, size }) => {
  return (
    <View>
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