import { TouchableOpacity } from 'react-native'
import React from 'react'
import TextButton from './texts/TextButton'

interface Props {
    label: string;
    handlePress: () => void;
    buttonStyles: string;
    isLoading: boolean;
}

const RedirectButton: React.FC<Props> = ({ label, handlePress, buttonStyles, isLoading }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`bg-brown rounded-xl justify-center items-center px-6 py-2 ${buttonStyles} ${isLoading ? "opacity-50" : ""}`}
            disabled={isLoading}>
            <TextButton
                label={label}
            />
        </TouchableOpacity>
    )
}

export default RedirectButton