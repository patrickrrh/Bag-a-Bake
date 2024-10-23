import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import TextTitle5Bold from './texts/TextTitle5Bold';

interface Props {
    label: string;
    onPress: () => void;
    buttonStyles?: string;
    isLoading: boolean;
}

const AcceptOrderButton: React.FC<Props> = ({ label, onPress, buttonStyles, isLoading }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className='bg-brown rounded-full justify-center items-center px-6 py-2 w-full'
            disabled={isLoading}
            style={{ flex: 1, marginHorizontal: 10 }}
        >
            <TextTitle5Bold label='Terima' color='white' />
        </TouchableOpacity>
    )
}

export default AcceptOrderButton