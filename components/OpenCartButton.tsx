import { TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import TextButton from './texts/TextButton'
import { icons } from "@/constants/icons";
import TextSmallCustomButton from './texts/TextSmallCustomButton';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

interface Props {
    label: string;
    handlePress: () => void;
    buttonStyles?: string;
    isLoading: boolean;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
}

const OpenCartButton: React.FC<Props> = ({ label, handlePress, buttonStyles, isLoading, icon, iconColor }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`bg-[#FA6F33] justify-center items-center px-2 py-1 rounded ${buttonStyles} ${isLoading ? "opacity-50" : ""}`}
            disabled={isLoading}>
                <View className="flex-row items-center">
                    <View className="mr-2" style={{ paddingVertical: 2 }}>
                        <Ionicons name={icon} size={14} color={iconColor} />
                    </View>
                    <TextSmallCustomButton label={label} />
                </View>

        </TouchableOpacity>
    )
}

export default OpenCartButton