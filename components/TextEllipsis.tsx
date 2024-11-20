import { Text, TextStyle } from 'react-native';
import React from 'react';

interface Props {
  label: string | number;
  color?: string;
  textStyle?: TextStyle;
}

const TextEllipsis: React.FC<Props> = ({ label, color, textStyle }) => {
  return (
    <Text
      style={[
        { fontFamily: 'poppinsRegular', fontSize: 12, color: color || 'black' },
        textStyle,
      ]}
      numberOfLines={2}
      ellipsizeMode="tail"
    >
      {label}
    </Text>
  );
};

export default TextEllipsis;
