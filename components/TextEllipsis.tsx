import { Text, TextStyle } from 'react-native';
import React from 'react';

interface Props {
  label: string | number;
  color?: string;
  textStyle?: TextStyle;
  line?: number;
}

const TextEllipsis: React.FC<Props> = ({ label, color, textStyle, line }) => {
  return (
    <Text
      style={[
        { fontFamily: 'poppinsRegular', fontSize: 12, color: color || 'black' },
        textStyle,
      ]}
      numberOfLines={line ? line : 2}
      ellipsizeMode="tail"
    >
      {label}
    </Text>
  );
};

export default TextEllipsis;
