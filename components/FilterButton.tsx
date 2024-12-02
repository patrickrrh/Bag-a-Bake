import { View, TextInput, TouchableOpacity, Image, Text } from 'react-native'
import React, { useState } from 'react'
import TextFormLabel from './texts/TextFormLabel'
import { images } from '@/constants/images'
import TextTitle5 from './texts/TextTitle5';
import TextTitle5Bold from './texts/TextTitle5Bold';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    label: string;
    isSelected: boolean
    onPress: () => void;
    isDropdown?: boolean
}

const FilterButton: React.FC<Props> = ({ label, isSelected, onPress, isDropdown }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`rounded-xl py-1 px-3 mr-3 ${isSelected ? 'bg-[#FFF2EB]' : 'bg-gray-100'}`}
        >
            <View className="flex-row items-center">
                {isSelected ? (
                    <Text style={{ fontFamily: "poppinsSemiBold", fontSize: 12 }} className="text-primary">
                        {label}
                    </Text>
                ) : (
                    <Text style={{ fontFamily: "poppinsRegular", fontSize: 12 }} className="text-primary">
                        {label}
                    </Text>
                )}
                { isDropdown && (
                    <Ionicons name="chevron-down" size={12} color="#331612" style={{ marginLeft: 4 }} />
                )}
            </View>
        </TouchableOpacity>

    );
};

export default FilterButton