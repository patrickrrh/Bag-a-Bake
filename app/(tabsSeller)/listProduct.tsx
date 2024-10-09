import { View, Text, Image, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import SellerLayout from './sellerLayout';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import CustomLogo from '@/components/CustomLogo';
import TextHeader from '@/components/texts/TextHeader';
import TextHeadline from '@/components/texts/TextHeadline';
import { router } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';

interface ListProductProps {
    navigation: StackNavigationProp<any>; 
  }

  const ListProduct: React.FC<ListProductProps> = ({ navigation })=> {

    const headerContent = (
        <>
          <View className="mt-16">
            <TextHeader label="List Product" />
          </View>
        </>
      )

    return (

    <SellerLayout headerContent={headerContent} >
      
      <CustomButton
                label='Tambahkan Produk'
                handlePress={() => {
                    navigation.navigate('CreateProduct'); 
                }}
                buttonStyles='mt-4'
                isLoading={false} 
            />

      {/* {
        error && (
          <View className="mt-4 flex-row justify-center">
            <ErrorMessage label={error} />
          </View>
        )
      } */}
    </SellerLayout>

    
    );
  };
  
  export default ListProduct;
  