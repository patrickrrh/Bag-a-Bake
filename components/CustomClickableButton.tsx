import { TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import TextButton from './texts/TextButton'
import { icons } from "@/constants/icons";
import TextSmallCustomButton from './texts/TextSmallCustomButton';

interface Props {
    label: string;
    handlePress: () => void;
    buttonStyles: string;
    isLoading: boolean;
    icon: keyof typeof icons;
}

const CustomClickableButton: React.FC<Props> = ({ label, handlePress, buttonStyles, isLoading, icon }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`bg-brown justify-center items-center px-2 py-1 rounded ${buttonStyles} ${isLoading ? "opacity-50" : ""}`}
            disabled={isLoading}>
                <View className="flex-row items-center">
                    <View className="pr-1">
                        <Image
                            source={icons[icon]}
                            style={{ width: 20, height: 20 }}
                        />
                    </View>
                    <TextSmallCustomButton label={label} />
                </View>

        </TouchableOpacity>
    )
}

export default CustomClickableButton