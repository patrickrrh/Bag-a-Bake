import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
}

const TextHeadline: React.FC<Props> = ({ label }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsRegular", fontSize: 14 }}
        className='text-black'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextHeadline