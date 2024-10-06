import { View, Text, Image, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import UploadButton from '@/components/UploadButton';
import { Picker } from '@react-native-picker/picker';
import SellerLayout from './sellerLayout';

const Home = () => {
  const navigation = useNavigation();
  
  const [form, setForm] = useState({
    productName: '',
    productDescription: '',
    category: '',
    expirationDate: '',
    initialPrice: '',
    discountDay1: '',
    discountDay2: '',
    discountDay3: '',
    stock: 0,
    productPhoto: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, productPhoto: result.assets[0].uri });
    }
  };

  const handleAddProduct = () => {
    console.log(form);
  };

  return (
    <SafeAreaView className="flex-1 p-4">
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Back Button */}
    
      {/* Add Product Button */}
      <CustomButton
        label="HOME"
        handlePress={handleAddProduct}
        buttonStyles="mt-6"
        isLoading={isSubmitting}
      />

      {error && (
        <View className="mt-4 flex-row justify-center w-full">
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      )}

    </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
