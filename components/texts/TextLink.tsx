import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Href, Link } from 'expo-router'

interface Props {
    label: string
    size?: number
}

const TextLink: React.FC<Props> = ({ label, size }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsMedium", fontSize: size, color: "#B0795A" }}
      >
        {label}
      </Text>
    </View>
  )
}

export default TextLink