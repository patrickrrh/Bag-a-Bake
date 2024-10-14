import { View, Text } from 'react-native'
import React from 'react'

interface Props {
    label: string
}

const ErrorMessage: React.FC<Props> = ({ label }) => {  
  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsMedium", fontSize: 14 }}
        className='text-red-500 mt-2'
      >
        {label}
      </Text>
    </View>
  )
}

export default ErrorMessage