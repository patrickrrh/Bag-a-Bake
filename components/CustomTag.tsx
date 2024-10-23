import { View, Text } from 'react-native';
import React from 'react';
import TextTag from './texts/TextTag';

interface BadgeProps {
  count: number;
}

const CustomTag: React.FC<BadgeProps> = ({ count }) => {
  return (
    <View
      className='bg-orange px-3 justify-center items-center rounded-full'
    >
      <TextTag label={`${count} tersisa`} />
    </View>
  );
};

export default CustomTag;
