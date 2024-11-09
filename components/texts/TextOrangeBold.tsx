import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
}

const TextOrangeBold: React.FC<Props> = ({ label }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppins", fontSize: 16, fontWeight: "bold" }}
        className='text-orange'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextOrangeBold