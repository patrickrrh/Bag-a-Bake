import { View, Text, Image, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton';
import BackButton from '@/components/BackButton';
import FormField from '@/components/FormField';
import UploadButton from '@/components/UploadButton';
import { Picker } from '@react-native-picker/picker';
import SellerLayout from './sellerLayout';

const CreateProduct = () => {
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
 
      <BackButton handlePress={() => console.log('Back button pressed')} />

      {/* Title */}
      <Text className="text-xl font-bold mt-4">Tambahkan Produk</Text>

      {/* Preview Photo */}
      <View className="mt-4 items-center">
        {form.productPhoto ? (
          <Image
            source={{ uri: form.productPhoto }}
            className="w-32 h-32 rounded-md"
            resizeMode="cover"
          />
        ) : (
          <View className="w-32 h-32 bg-gray-200 rounded-md" />
        )}
      </View>

      {/* Upload Photo Button */}
      <View className="mt-4 w-full items-center">
      <UploadButton label="Unggah Foto" handlePress={pickImage} />
      </View>

     {/* Product Name Field */}
    <FormField
        label="Nama Produk"  
        value={form.productName}
        onChangeText={(text) => setForm({ ...form, productName: text })}
    />

    {/* Product Description Field */}
    <FormField
        label="Deskripsi Produk" 
        value={form.productDescription}
        onChangeText={(text) => setForm({ ...form, productDescription: text })}
    />


      {/* Category Dropdown */}
      <Text className="mt-4">Kategori</Text>
      <Picker
        selectedValue={form.category}
        onValueChange={(itemValue) => setForm({ ...form, category: itemValue })}
        style={{ height: 50, width: '100%' }}
      >
        <Picker.Item label="Pilih Kategori" value="" />
        <Picker.Item label="Kategori1" value="kategori1" />
        <Picker.Item label="Kategori2" value="kategori2" />
        <Picker.Item label="Kategori3" value="kategori3" />
      </Picker>

      {/* Expiration Date Field */}
    <FormField
    label="Tanggal Kedaluwarsa"  
    value={form.expirationDate}
    onChangeText={(text) => setForm({ ...form, expirationDate: text })}
    placeholder="YYYY-MM-DD"
    />

    {/* Initial Price Field */}
    <FormField
    label="Harga Awal" 
    value={form.initialPrice}
    onChangeText={(text) => setForm({ ...form, initialPrice: text })}
    keyboardType="numeric"
    />
    
      {/* Discount Fields */}
      <Text className="mt-4">Potongan Harga</Text>
      <View className="flex-row justify-between">
      <View className="flex-1 mr-2">
        <FormField
        value={form.discountDay1}
        onChangeText={(text) => setForm({ ...form, discountDay1: text })}
        keyboardType="numeric"
        placeholder="Hari 1"
        />
      </View>
      <View className="flex-1 mr-2">
        <FormField
        value={form.discountDay2}
        onChangeText={(text) => setForm({ ...form, discountDay2: text })}
        keyboardType="numeric"
        placeholder="Hari 2"
        />
      </View>
      <View className="flex-1 mr-2">
        <FormField
        value={form.discountDay3}
        onChangeText={(text) => setForm({ ...form, discountDay3: text })}
        keyboardType="numeric"
        placeholder="Hari 3"
        />
      </View>
      </View>

      {/* Stock Field */}
      <Text className="mt-4">Jumlah Stok</Text>
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => setForm({ ...form, stock: Math.max(0, form.stock - 1) })}
          className="p-2 bg-gray-300 rounded-full"
        >
          <Text>-</Text>
        </TouchableOpacity>
        <TextInput
          value={form.stock.toString()}
          onChangeText={(text) => setForm({ ...form, stock: parseInt(text) || 0 })}
          keyboardType="numeric"
          style={{ textAlign: 'center', marginHorizontal: 8, flex: 1 }}
        />
        <TouchableOpacity
          onPress={() => setForm({ ...form, stock: form.stock + 1 })}
          className="p-2 bg-gray-300 rounded-full"
        >
          <Text>+</Text>
        </TouchableOpacity>
      </View>

      {/* Add Product Button */}
      <CustomButton
        label="Tambahkan Produk"
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

export default CreateProduct;
