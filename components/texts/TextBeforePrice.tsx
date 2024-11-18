import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
    size?: number
}

const TextBeforePrice: React.FC<Props> = ({ label, size }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsSemiBold", textDecorationLine: "line-through", textDecorationColor: "#FA6F33", fontSize: size || 12 }}
        className='text-black'
      >
       {label}
      </Text>
    </View>
  )
}

export default TextBeforePrice