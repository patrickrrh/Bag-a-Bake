import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Href, Link } from 'expo-router'

interface Props {
    label: string
    size?: number
    link: Href
}

const TextLink: React.FC<Props> = ({ label, size, link }) => {
  return (
      <Link
        style={{ fontFamily: "poppinsMedium", fontSize: size, color: "#B0795A" }}
        href={link}
      >
        {label}
      </Link>
  )
}

export default TextLink