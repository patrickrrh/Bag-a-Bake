import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
}

const TextTitle3: React.FC<Props> = ({ label }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsSemiBold", fontSize: 16 }}
        className='text-black'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextTitle3