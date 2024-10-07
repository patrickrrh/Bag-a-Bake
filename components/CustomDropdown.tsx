import { View, TextInput, TouchableOpacity, Image, Text } from 'react-native'
import React, { useState } from 'react'
import TextFormLabel from './texts/TextFormLabel'
import { images } from '@/constants/images'
import ErrorMessage from './texts/ErrorMessage';
import { Dropdown } from 'react-native-element-dropdown'

interface Props {
    label: string;
    data: any[];
    value: string;
    placeholder: string;
    labelField: string;
    valueField: string;
    onChange: (value: string) => void;
    moreStyles?: string;
    error?: number | string | null;
}

const CustomDropdown: React.FC<Props> = ({ label, data, value, placeholder, labelField, valueField, onChange, moreStyles, error }) => {
    console.log("value", value)
    return (
        <View className={`space-y-1 ${moreStyles}`}>
            <TextFormLabel label={label} />
            <View className={`w-full h-[40px] bg-white rounded-[8px] border ${error ? 'border-red-500' : 'border-gray-200'} focus:border-primary flex justify-center`}>
                <Dropdown
                    data={data}
                    value={value}
                    labelField={labelField}
                    valueField={valueField}
                    placeholder={placeholder}
                    onChange={(item) => onChange(item[valueField])}
                    search
                    searchPlaceholder='Cari...'
                    style={{
                        height: 60,
                        width: '100%',
                        paddingHorizontal: 15,
                    }}
                    inputSearchStyle={{
                        height: 40,
                        fontSize: 16,
                    }}
                    selectedTextStyle={{
                        fontSize: 14,
                        color: '#000',
                    }}
                    placeholderStyle={{
                        fontSize: 14,
                        color: '#828282',
                        textAlignVertical: 'center',
                    }}
                />
            </View>
            {error && (
                <ErrorMessage label={error as string} />
            )}

        </View>
    )
}

export default CustomDropdown