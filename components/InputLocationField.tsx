import { View, TextInput, TouchableOpacity, Image, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import TextFormLabel from './texts/TextFormLabel'
import { images } from '@/constants/images'
import ErrorMessage from './texts/ErrorMessage';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    label: string;
    value: string | number;
    placeholder?: string;
    onChangeText: (text: string) => void;
    moreStyles?: string;
    error?: string | null;
    suggestions: any[];
    onSearch: () => void;
    onSelectSuggestion: (item: any) => void;
}

const InputLocationField: React.FC<Props> = ({ label, value, placeholder, onChangeText, moreStyles, error, suggestions, onSearch, onSelectSuggestion }) => {

    return (
        <View className={`space-y-1 ${moreStyles}`}>
            <TextFormLabel label={label} />
            <View className={`w-full h-[46px] bg-white rounded-[8px] border ${error ? 'border-red-500' : 'border-gray-200'} focus:border-primary flex-row items-center`}>
                <TextInput
                    className="flex-1 px-4 text-black"
                    style={{ fontFamily: 'poppinsRegular', fontSize: 14 }}
                    value={value as any}
                    placeholder={placeholder}
                    placeholderTextColor="#828282"
                    onChangeText={onChangeText}
                    keyboardType='default'
                    textAlignVertical="center"
                />
                <TouchableOpacity 
                    className="p-3 rounded-r-[8px] bg-brown h-full justify-center items-center"
                    onPress={onSearch}
                >
                    <Ionicons name="search" size={16} color="white" />
                </TouchableOpacity>
            </View>

            {suggestions.length > 0 && (
                <View
                    style={{
                        maxHeight: 150,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 8,
                        backgroundColor: '#fff',
                        overflow: 'hidden',
                    }}
                >
                    <ScrollView nestedScrollEnabled>
                        {suggestions.map((item) => (
                            <TouchableOpacity
                                key={item.place_id}
                                onPress={() => {
                                    console.log("called how many time ")
                                    onSelectSuggestion(item);
                                }}
                            >
                                <Text className="p-2 border-b border-gray-200">{item.description}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}


            {error && <ErrorMessage label={error} />}
        </View>

    )
}

export default InputLocationField