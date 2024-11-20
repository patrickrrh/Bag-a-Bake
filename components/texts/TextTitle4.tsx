import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
    color?: string
}

const TextTitle4: React.FC<Props> = ({ label, color }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsSemiBold", fontSize: 14, color: color }}
        className='text-black'
        ellipsizeMode='tail'
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  )
}

export default TextTitle4