import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Href, Link } from 'expo-router'

interface Props {
    label: string
    size?: number
    onPress: () => void
}

const TextLink: React.FC<Props> = ({ label, size, onPress }) => {
  return (
      <Text
        style={{ fontFamily: "poppinsMedium", fontSize: size, color: "#B0795A" }}
        onPress={onPress}
      >
        {label}
      </Text>
  )
}

export default TextLink