import { TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const CircleBackButton: React.FC = () => {

    const handlePress = () => {
        router.back();
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={styles.button}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <View>
                <Text>
                    {"<"}
                </Text>
            </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,        
        height: 50,       
        borderRadius: 25, 
        backgroundColor: '#fff', 
        shadowColor: "#000",     
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,    
    },
    text: {
        fontSize: 24,    
        color: '#000',  
        fontFamily: 'poppinsMedium', 
    },
});

export default CircleBackButton;
