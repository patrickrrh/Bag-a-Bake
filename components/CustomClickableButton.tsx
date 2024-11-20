import { TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import TextButton from './texts/TextButton'
import { icons } from "@/constants/icons";
import TextSmallCustomButton from './texts/TextSmallCustomButton';
import { FontAwesome } from '@expo/vector-icons';

interface Props {
    label: string;
    handlePress: () => void;
    buttonStyles?: string;
    isLoading: boolean;
    icon: keyof typeof FontAwesome.glyphMap;
    iconColor?: string;
}

const CustomClickableButton: React.FC<Props> = ({ label, handlePress, buttonStyles, isLoading, icon, iconColor }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`bg-brown justify-center items-center px-2 py-1 rounded ${buttonStyles} ${isLoading ? "opacity-50" : ""}`}
            disabled={isLoading}>
                <View className="flex-row items-center">
                    <View className="mr-2" style={{ paddingVertical: 2 }}>
                        <FontAwesome name={icon} size={14} color={iconColor} />
                    </View>
                    <TextSmallCustomButton label={label} />
                </View>

        </TouchableOpacity>
    )
}

export default CustomClickableButton