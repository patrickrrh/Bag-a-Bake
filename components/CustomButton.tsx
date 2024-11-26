import { TouchableOpacity } from 'react-native'
import React from 'react'
import TextButton from './texts/TextButton'

interface Props {
    label: string;
    handlePress: () => void;
    buttonStyles?: string;
    isLoading: boolean;
    color?: string
    disabled?: boolean
}

const CustomButton: React.FC<Props> = ({ label, handlePress, buttonStyles, isLoading, disabled }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`rounded-xl min-h-[48px] justify-center items-center ${buttonStyles} ${isLoading || disabled ? 'bg-gray-400' : 'bg-brown'
                } ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading || disabled}
        >
            <TextButton
                label={label}
            />
        </TouchableOpacity>
    )
}

export default CustomButton