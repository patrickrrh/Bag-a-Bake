import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
}

const TextButton: React.FC<Props> = ({ label }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "dk", fontSize: 18 }}
        className='text-white'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextButton