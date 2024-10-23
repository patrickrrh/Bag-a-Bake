import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
}

const TextTitle4: React.FC<Props> = ({ label }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsSemiBold", fontSize: 14 }}
        className='text-black'
        ellipsizeMode='tail'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextTitle4