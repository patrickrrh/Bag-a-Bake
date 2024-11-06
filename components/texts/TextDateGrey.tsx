import { View, Text } from 'react-native';
import React from 'react';

interface Props {
    label: string;
}

const TextDateGrey: React.FC<Props> = ({ label }) => {
    return (
        <View>
            <Text
                style={{ 
                    fontFamily: "poppinsRegular", 
                    fontSize: 14, 
                    color: '#8c8b89' 
                }}
            >
                {label}
            </Text>
        </View>
    );
}

export default TextDateGrey;
