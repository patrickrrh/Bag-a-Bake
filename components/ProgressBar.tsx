import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '@/constants/images'

interface Props {
    progress: number;
}

const ProgressBar: React.FC<Props> = ({ progress }) => {
    return (
        <View className="my-5">
            <View className="w-full h-2 bg-[#EFEAEA] rounded-full overflow-hidden">
                <View className="h-full bg-brown rounded-full" style={{ width: `${progress * 100}%` }} />
            </View>
        </View>
    )
}

export default ProgressBar