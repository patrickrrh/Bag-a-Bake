import { View, TextInput, TouchableOpacity, Image, Text } from 'react-native'
import React, { useState } from 'react'
import TextFormLabel from './texts/TextFormLabel'
import { images } from '@/constants/images'
import TextTitle5 from './texts/TextTitle5';
import TextTitle5Bold from './texts/TextTitle5Bold';

interface Props {
    label: string;
    isSelected: boolean
    onPress: () => void;
}

const FilterButton: React.FC<Props> = ({ label, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`rounded-xl py-1 px-3 mr-3 ${isSelected? 'bg-brown' : 'bg-gray-100'}`}
        >
            {
                isSelected ? (
                    <Text style={{ fontFamily: "poppinsSemiBold", fontSize: 12 }} className='text-white'>
                        {label}
                    </Text>
                ) : (
                    <Text style={{ fontFamily: "poppinsRegular", fontSize: 12 }} className='text-primary'>
                    {label}
                </Text>
                )
            }
        </TouchableOpacity>
    );
};

export default FilterButton