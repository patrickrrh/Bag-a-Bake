import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
}

const TextUpload: React.FC<Props> = ({ label }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsSemiBold", fontSize: 8 }}
        className='text-orange'
      >
        {label}
      </Text>
    </View>
  )
}

export default TextUpload