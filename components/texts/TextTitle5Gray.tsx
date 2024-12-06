import { View, Text, TextStyle } from 'react-native'
import React from 'react'

interface Props {
    label: string
    textStyle?: TextStyle
}

const TextTitle5Gray: React.FC<Props> = ({ label, textStyle }) => {
  return (
    <View>
      <Text
          style={[{ fontFamily: "poppinsRegular", fontSize: 12, color: 'black', opacity: 0.5 }, textStyle]}
      >
        {label}
      </Text>
    </View>
  )
}

export default TextTitle5Gray