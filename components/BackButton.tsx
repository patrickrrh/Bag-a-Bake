import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native'; 

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
        >
            <Image
                source={require('@/assets/images/backIcon.png')}
                style={styles.image}
                resizeMode="contain"
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
