import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
}

const TextSmallCustomButton: React.FC<Props> = ({ label }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsSemiBold", fontSize: 10 }}
        className='text-white'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextSmallCustomButton