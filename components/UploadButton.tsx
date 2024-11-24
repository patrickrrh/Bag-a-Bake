import { TouchableOpacity } from 'react-native'
import React from 'react'
import TextUpload from './texts/TextUpload';

interface Props {
    label: string;
    handlePress: () => void;
    buttonStyles?: string;
}

const UploadButton: React.FC<Props> = ({ label, handlePress, buttonStyles }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`bg-transparent rounded-md h-[26px] px-4 border justify-center border-orange ${buttonStyles}`}
            >
            <TextUpload
                label={label}
            />
        </TouchableOpacity>
    )
}

export default UploadButton