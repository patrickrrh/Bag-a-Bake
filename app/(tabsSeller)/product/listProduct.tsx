import { View, Text, Image, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import CustomLogo from '@/components/CustomLogo';
import TextHeader from '@/components/texts/TextHeader';
import TextTitle3 from '@/components/texts/TextTitle3';
import { router } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";

interface ListProductProps {
    navigation: StackNavigationProp<any>; 
  }

  const ListProduct: React.FC<ListProductProps> = ({ navigation })=> {


    return (

      <SafeAreaView className="bg-background h-full flex-1">
      <View className="flex-row items-center px-4 pt-4 pb-2 relative">
        {/* Back Button */}
        <View className="pl-5">
          <BackButton />
        </View>

        {/* Title */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 10,
          }}
        >
          <TextTitle3 label="Tambahkan Produk" />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
     
      <CustomButton
                label='Tambahkan Produk'
                handlePress={() => {
                  router.push({
                    pathname: '/product/createProduct'
                  })
                }}
                buttonStyles='mt-4'
                isLoading={false} 
            />
      </ScrollView>

      </SafeAreaView>
      



    
    );
  };
  
  export default ListProduct;
  