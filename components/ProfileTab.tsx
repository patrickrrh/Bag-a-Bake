import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ProfileTabProps {
  selectedStatus: number;
  onSelectStatus: (status: number) => void;
}

const statuses: Array<1 | 2> = [1, 2];

const ProfileTab: React.FC<ProfileTabProps> = ({
  selectedStatus,
  onSelectStatus,
}) => {
  const statusMapping: Record<number, string> = {
    1: "Pengguna",
    2: "Toko",
  };

  return (
    <View className="flex-row space-x-8">
      {statuses.map((status) => (
        <TouchableOpacity
          key={status}
          onPress={() => onSelectStatus(status)}
          className="items-center pt-2"
        >
          <Text
            className={`text-lg font-bold pb-5 ${
              selectedStatus === status
                ? "text-brown opacity-100"
                : "text-black opacity-50"
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

export default ProfileTab;
