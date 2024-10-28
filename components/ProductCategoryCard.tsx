import { View, TextInput, TouchableOpacity, Image, Text } from 'react-native'
import React, { useState } from 'react'
import TextFormLabel from './texts/TextFormLabel'
import { images } from '@/constants/images'
import TextTitle5 from './texts/TextTitle5';

interface Props {
    label: string;
    onPress: () => void;
}

const ProductCategoryCard: React.FC<Props> = ({ label, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`w-20 h-28 mr-2 flex-col items-center justify-center rounded-lg bg-brown`}
        >
            <Image
                source={images.logo}
                className="mb-4"
                style={{ width: 50, height: 50, resizeMode: 'contain' }}
            />
            <TextTitle5 label={label} color='white' />
        </TouchableOpacity>
    );
};

export default ProductCategoryCard