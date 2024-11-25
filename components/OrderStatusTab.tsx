import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface OrderStatusTabProps {
  selectedStatus: number;
  onSelectStatus: (status: number) => void;
}

const statuses: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];

const OrderStatusTab: React.FC<OrderStatusTabProps> = ({ selectedStatus, onSelectStatus }) => {
  
  const statusMapping = {
    1: 'Pending',
    2: 'Pembayaran',
    3: 'Berlangsung',
    4: 'Selesai',
  };

  return (
    <View className="flex-row justify-around">
      {statuses.map((status) => (
        <TouchableOpacity
          key={status}
          onPress={() => onSelectStatus(status)}
          className="items-center pt-2"
        >
          <Text
            className={`text-md font-bold pb-5 ${
              selectedStatus === status ? 'text-brown opacity-100' : 'text-black opacity-50'
            }`}
          >
            {statusMapping[status]}
          </Text>
          {selectedStatus === status && (
            <View className="w-[50%] h-1 bg-brown rounded-lg mt-1" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default OrderStatusTab;
