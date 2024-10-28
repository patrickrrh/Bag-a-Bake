import { TouchableOpacity } from 'react-native'
import React from 'react'
import TextButton from './texts/TextButton'

interface Props {
    label: string;
    handlePress: () => void;
    buttonStyles?: string;
    isLoading: boolean;
}

const ContactButton: React.FC<Props> = ({ label, handlePress, buttonStyles, isLoading }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`border border-black rounded-xl min-h-[48px] justify-center items-center ${buttonStyles} ${isLoading ? "opacity-50" : ""}`}
            disabled={isLoading}>
            <TextButton
                label={label}
                color='black'
            />
        </TouchableOpacity>
    )
}

export default ContactButton