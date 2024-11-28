import { View, Text, Image } from 'react-native'
import React from 'react'

interface Props {
    image: any;
}

const LargeImage: React.FC<Props> = ({ image }) => {
    return (
        <Image
            source={image}
            resizeMode='cover'
            className='w-full h-40'
        />
    )
}

export default LargeImage