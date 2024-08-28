import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
}

const TextFormLabel: React.FC<Props> = ({ label }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsSemiBold", fontSize: 14 }}
        className='text-black'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextFormLabel