import { TouchableOpacity } from 'react-native'
import React from 'react'
import TextButton from './texts/TextButton'

interface Props {
    label: string;
    handlePress: () => void;
    buttonStyles?: string;
    isLoading: boolean;
    color?: string
}

const CustomButtonOutline: React.FC<Props> = ({ label, handlePress, buttonStyles, isLoading, color }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`border-brown border-2 rounded-xl min-h-[48px] justify-center items-center ${buttonStyles} ${isLoading ? "opacity-50" : ""}`}
            disabled={isLoading}>
            <TextButton
                label={label}
                color={color}
            />
        </TouchableOpacity>
    )
}

export default CustomButtonOutline
