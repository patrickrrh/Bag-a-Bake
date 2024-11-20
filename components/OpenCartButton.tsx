import { TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import TextButton from './texts/TextButton'
import { icons } from "@/constants/icons";
import TextSmallCustomButton from './texts/TextSmallCustomButton';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import TextTitle3 from './texts/TextTitle3';
import TextTitle4 from './texts/TextTitle4';

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
            className={`bg-brown justify-center items-center px-2 py-1 h-10 rounded ${buttonStyles} ${isLoading ? "opacity-50" : ""}`}
            disabled={isLoading}>
                <View className="flex-row items-center">
                    <View className="mr-2">
                        <Ionicons name={icon} size={16} color={iconColor} />
                    </View>
                    <View className="mt-1">
                        <TextTitle4 label={label} color='white'/>
                    </View>
                </View>

        </TouchableOpacity>
    )
}

export default OpenCartButton