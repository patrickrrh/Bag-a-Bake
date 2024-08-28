import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '@/constants/images'

interface Props {
    imageWidth: number;
    imageHeight: number;
    fontSize: number;
}

const CustomLogo: React.FC<Props> = ({ imageWidth, imageHeight, fontSize }) => {
    return (
        <View className='justify-center items-center'>
            <Image
                source={images.logo}
                style={{ width: imageWidth, height: imageHeight }}
                resizeMode="contain"
            />
            <Text
                style={{ fontFamily: "dk", fontSize: fontSize }}
                className="text-black mt-2"
            >
                Bag a Bake
            </Text>
        </View>
    )
}

export default CustomLogo