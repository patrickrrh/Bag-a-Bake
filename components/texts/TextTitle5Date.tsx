import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
}

const TextTitle5Date: React.FC<Props> = ({ label }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsRegular", fontSize: 12, opacity: 0.5 }}
        className='text-black'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextTitle5Date