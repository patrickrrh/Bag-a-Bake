import { View, Text } from 'react-native'
import React from 'react'

interface Props {
  label: string;
  isSelected?: boolean;
}

const TextFormLabel: React.FC<Props> = ({ label, isSelected }) => {

  const getColor = () => {
    if (isSelected === true) return '#B0795A';
    if (isSelected === false) return '#828282';
    return '#000000';
  };

  return (
    <View>
      <Text
        style={{ fontFamily: "poppinsSemiBold", fontSize: 14, color: getColor() }}
      >
        {label}
      </Text>
    </View>
  )
}

export default TextFormLabel