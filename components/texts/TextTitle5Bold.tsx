import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
    color?: string
}

const TextTitle5Bold: React.FC<Props> = ({ label, color }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsSemiBold", fontSize: 12, color: color }}
        className='text-black'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextTitle5Bold