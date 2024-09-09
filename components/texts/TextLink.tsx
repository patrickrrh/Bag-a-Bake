import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
}

const TextLink: React.FC<Props> = ({ label }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsMedium", fontSize: 14 }}
        className='text-brown'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextLink