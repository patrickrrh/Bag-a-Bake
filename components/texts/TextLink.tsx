import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Href, Link } from 'expo-router'

interface Props {
    label: string
    size?: number
    onPress: () => void
    isUnderline?: boolean
}

const TextLink: React.FC<Props> = ({ label, size, onPress, isUnderline }) => {
  return (
      <Text
        style={{ fontFamily: "poppinsMedium", fontSize: size, color: "#B0795A", textDecorationLine: isUnderline ? "underline" : "none" }}
        onPress={onPress}
      >
        {label}
      </Text>
  )
}

export default TextLink