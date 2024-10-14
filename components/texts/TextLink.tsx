import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
    size?: number
}

const TextLink: React.FC<Props> = ({ label, size }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsMedium", fontSize: size }}
        className='text-brown'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextLink