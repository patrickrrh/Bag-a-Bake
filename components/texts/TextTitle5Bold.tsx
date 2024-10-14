import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
}

const TextTitle5Bold: React.FC<Props> = ({ label }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsSemiBold", fontSize: 12 }}
        className='text-black'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextTitle5Bold