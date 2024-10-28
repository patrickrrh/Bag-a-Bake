import { View, TextInput, TouchableOpacity, Image, Text } from 'react-native'
import React, { useState } from 'react'
import TextFormLabel from './texts/TextFormLabel'
import { images } from '@/constants/images'

interface Props {
    label: string;  
    isSelected: boolean;
    onPress: () => void;
}

const RoleCard: React.FC<Props> = ({ label, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`w-[150px] h-[180px] flex-col items-center justify-center rounded-lg border ${isSelected ? 'border-primary' : 'border-gray-200'
                } bg-white shadow-md`}
        >
            <Image
                source={images.logo}
                className="mb-4"
                style={{ width: 50, height: 50, resizeMode: 'contain' }}
            />
            <TextFormLabel label={label} />
        </TouchableOpacity>
    );
};

export default RoleCard