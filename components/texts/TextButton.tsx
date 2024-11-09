import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
    color?: string
}

const TextButton: React.FC<Props> = ({ label, color }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsSemiBold", fontSize: 16, color: color || "white" }}
      >
        {label}
      </Text>
    </View>
  )
}

export default TextButton