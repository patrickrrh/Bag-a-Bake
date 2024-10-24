import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface Props {
    label: string
    size?: number
    onPress?: () => void
}

const TextLink: React.FC<Props> = ({ label, size, onPress }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsMedium", fontSize: size }}
        className='text-brown'
        onPress={onPress}
      >
        {label}
      </Text>
    </View>
  )
}

export default TextLink