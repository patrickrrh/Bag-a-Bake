import { View, Text } from 'react-native';
import React from 'react';

interface BadgeProps {
  count: number;
}

const CustomTag: React.FC<BadgeProps> = ({ count }) => {
  return (
    <Text
      className='bg-orange'
      style={{
        color: 'white',
        paddingVertical: 4,
        paddingHorizontal: 14,
        borderRadius: 20,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
      }}
    >
      {count} tersisa
    </Text>
  );
};

export default CustomTag;
