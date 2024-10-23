import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
    size?: number
}

const TextBeforePrice: React.FC<Props> = ({ label, size }) => {
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsSemiBold", textDecorationLine: "line-through", textDecorationColor: "#FA6F33", fontSize: 12 }}
        className='text-black'
      >
       {`Rp${label}/pcs`}
      </Text>
    </View>
  )
}

export default TextBeforePrice