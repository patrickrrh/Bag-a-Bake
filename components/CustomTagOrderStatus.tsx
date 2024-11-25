import { View, Text } from 'react-native';
import React from 'react';
import TextTag from './texts/TextTag';

interface Props {
  status: 1 | 2 | 3;
}

const CustomTagOrderStatus: React.FC<Props> = ({ status }) => {
    
    const statusMapping = {
        1: 'Pending',
        2: 'Pembayaran',
        3: 'Berlangsung',
        4: 'Selesai',
        5: 'Dibatalkan',
    }
    
  return (
    <View
      className='bg-orange px-3 justify-center items-center rounded-lg'
    >
      <TextTag label={statusMapping[status]} />
    </View>
  );
};

export default CustomTagOrderStatus;
