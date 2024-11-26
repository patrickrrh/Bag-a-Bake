import { View, Text, ViewStyle, TextStyle } from 'react-native';
import React from 'react';

interface Props {
  label: string;
  color?: string;
  style?: TextStyle;
}

const TextTitle5Bold: React.FC<Props> = ({ label, color, style }) => {
  return (
    <View>
      <Text
        style={[
          { fontFamily: "poppinsSemiBold", fontSize: 12, color: color }, style
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

export default TextTitle5Bold;
