import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const HomePage = () => {
  const navigation = useNavigation();

  // Function to handle card click and navigate to ProductDetail page
  // const handleProductClick = (product: Product) => {
  //   navigation.navigate('ProductDetail', { product } as { product: Product }); // Pass the product as a parameter
  // };

  return (
    <View>
      <Text>Rekomendasi untuk Anda</Text>
    </View>
  );
};

export default HomePage;
