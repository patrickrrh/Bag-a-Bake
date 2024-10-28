import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
    size?: number
}

const TextAfterPrice: React.FC<Props> = ({ label, size }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsSemiBold", fontSize: 16 }}
        className='text-primary'
      >
       {label}
      </Text>
    </View>
  )
}

export default TextAfterPrice