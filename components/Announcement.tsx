import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnnouncementProps {
  message: string;
  visible: boolean;
  onClose?: () => void;
}

const Announcement: React.FC<AnnouncementProps> = ({ message, visible, onClose }) => {
  if (!visible) return null;

  return (
    <View className="bg-red-100 px-4 py-3 rounded-lg border border-red-200 shadow-md flex-row items-center justify-between m-4">
      <View className="mr-3">
        <Ionicons name="alert-circle" size={20} color="#B91C1C" />
      </View>
      <Text className="text-red-800 text-sm font-regular flex-1">{message}</Text>
      {/* {onClose && (
        <TouchableOpacity onPress={onClose} className="ml-3">
          <Ionicons name="close" size={20} color="#B91C1C" />
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default Announcement;