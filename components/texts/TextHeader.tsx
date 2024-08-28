import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
}

const TextHeader: React.FC<Props> = ({ label }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "dk", fontSize: 34 }}
        className='text-primary'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextHeader