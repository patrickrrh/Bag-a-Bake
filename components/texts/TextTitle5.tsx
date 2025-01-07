import { View, Text, ViewStyle, TextStyle } from 'react-native';
import React from 'react';

interface Props {
  label: string | number;
  color?: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  ellipsis?: boolean;
}

const TextTitle5: React.FC<Props> = ({ label, color, containerStyle, textStyle, ellipsis }) => {
  return (
    <View style={containerStyle}>
      <Text
        style={[
          { fontFamily: 'poppinsRegular', fontSize: 12, color: color || 'black' },
          textStyle,
        ]}
        numberOfLines={ellipsis ? 1 : undefined}
        ellipsizeMode={ellipsis ? 'tail' : undefined}
      >
        {label}
      </Text>
    </View>
  );
};

export default TextTitle5;
