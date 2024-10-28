import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

interface Props {
    label: string
    size?: number
    link: string
}

const TextLink: React.FC<Props> = ({ label, size, link }) => {
  return (
    <View>
      <Link
        style={{ fontFamily: "poppinsMedium", fontSize: size, color: "#B0795A" }}
        href={link}
      >
        {label}
      </Link>
    </View>
  )
}

export default TextLink