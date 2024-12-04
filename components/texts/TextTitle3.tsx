import { View, Text, TextStyle } from 'react-native'
import React from 'react'

interface Props {
    label: string
    color?: string
    textStyle?: TextStyle
}

const TextTitle3: React.FC<Props> = ({ label, color, textStyle }) => {
  return (
    <View>
      <Text
          style={[{ fontFamily: "poppinsSemiBold", fontSize: 16, color: color || 'black' }, textStyle]}
      >
        {label}
      </Text>
    </View>
  )
}

export default TextTitle3