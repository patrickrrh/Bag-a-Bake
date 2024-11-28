import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

interface BackButtonProps {
    path?: string;
    params?: Record<string, any>;
}

const BackButton: React.FC<BackButtonProps> = ({ path, params }) => {

    const handlePress = () => {
        if (path) {
            router.push({
                pathname: path as any,
                params,
            });
        } else {
            router.back();
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={styles.button}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
            <FontAwesome
                name="angle-left"
                size={24}
                color="#000"
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 10,
        height: 24,
    },
    image: {
        width: 10, 
        tintColor: '#000', 
    },
});

export default BackButton;
