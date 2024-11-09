import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
    color?: string
}

const TextTitle3: React.FC<Props> = ({ label, color }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsSemiBold", fontSize: 16, color: color }}
        className='text-black'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextTitle3