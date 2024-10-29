import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native'; 
import { FontAwesome } from '@expo/vector-icons';

const BackButton: React.FC = () => {
    const navigation = useNavigation(); 

    const handlePress = () => {
        navigation.goBack();
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={styles.button}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
