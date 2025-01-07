import { View, TextInput, TouchableOpacity, Image, Text } from 'react-native'
import React, { useState } from 'react'
import TextFormLabel from './texts/TextFormLabel'
import { images } from '@/constants/images'
import { Ionicons } from '@expo/vector-icons';

interface Props {
    label: string;
    isSelected: boolean;
    onPress: () => void;
}

const RoleCard: React.FC<Props> = ({ label, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`w-[150px] h-[180px] flex-col items-center justify-center rounded-lg border ${isSelected ? 'border-brown' : 'border-gray-200'
                } bg-white shadow-sm`}
        >
            <View className='mb-2'>
                <Ionicons name={label === 'Pembeli' ? 'person-outline' : 'storefront-outline'} size={35} color={isSelected ? '#B0795A' : '#828282'} />
            </View>
            <TextFormLabel label={label} isSelected={isSelected} />
        </TouchableOpacity>
    );
};

export default RoleCard