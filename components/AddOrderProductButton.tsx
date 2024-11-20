import { TouchableOpacity, View, Text } from 'react-native'
import React from 'react'
import TextButton from './texts/TextButton'
import TextTitle3 from './texts/TextTitle3';
interface Props {
    label: string;
    handlePress: () => void;
    buttonStyles?: string;
    isLoading: boolean;
    disabled?: boolean;
    style?: any;
}

const AddOrderProductButton: React.FC<Props> = ({ label, handlePress, isLoading, disabled, style }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`rounded-xl min-h-[48px] justify-center items-center ${
                isLoading || disabled ? 'bg-gray-400' : 'bg-brown'
            } ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading || disabled}
            style={[
                style,
            ]}
        >
            <View className="flex-row justify-center items-center w-full gap-x-1">
                <TextTitle3 label={label} color='white'/>
            </View>
        </TouchableOpacity>
    )
}

export default AddOrderProductButton