import { TouchableOpacity, View, Text } from 'react-native'
import React from 'react'
import TextButton from './texts/TextButton'
interface Props {
    label: string;
    handlePress: () => void;
    buttonStyles?: string;
    isLoading: boolean;
}

const AddOrderProductButton: React.FC<Props> = ({ label, handlePress, isLoading }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`bg-brown rounded-xl min-h-[48px] justify-center items-center ${isLoading ? "opacity-50" : ""}`}
            disabled={isLoading}>
            <View className="flex-row justify-center items-center w-full gap-x-1">
                <Text style={{ fontFamily: "poppinsSemiBold", fontSize: 16, color: "white" }}>
                    Tambahkan Pesanan •
                </Text>
                <Text style={{ fontFamily: "poppins", fontSize: 18, color: "white", fontWeight: "bold" }}>
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default AddOrderProductButton