import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
}

const TextTag: React.FC<Props> = ({ label }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsMedium", fontSize: 12 }}
        className='text-white'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextTag