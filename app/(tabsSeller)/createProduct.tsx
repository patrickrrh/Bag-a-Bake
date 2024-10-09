import {
  View,
  Text,
  Image,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "@/components/CustomButton";
import BackButton from "@/components/BackButton";
import FormField from "@/components/FormField";
import UploadButton from "@/components/UploadButton";
import StockInput from "@/components/StockInput";
import TextAreaField from "@/components/TextAreaField";
import CustomDropdown from "@/components/CustomDropdown";
import TextTitle3 from "@/components/texts/TextTitle3";
import dayjs from "dayjs";
import "dayjs/locale/id";
import TextFormLabel from "@/components/texts/TextFormLabel";
import ExpirationDatePicker from "@/components/ExpirationDatePicker";
import PriceInputField from "@/components/PriceInputField";
import DiscountInputField from "@/components/DiscountInputField";

const CreateProduct = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    category: null,
    expirationDate: "",
    initialPrice: "",
    discountDay1: "",
    discountDay2: "",
    discountDay3: "",
    stock: 1,
    productPhoto: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, productPhoto: result.assets[0].uri });
    }
  };

  dayjs.locale("id");
  const handleDateConfirm = (date: Date) => {
    setForm({ ...form, expirationDate: dayjs(date).format("DD MMMM YYYY") });
    setError(null);
  };

  const handleAddProduct = () => {
    console.log(form);
  };

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
        <View style={{ paddingHorizontal: 20, flex: 1 }}>
          {/* Preview Upload Photo */}
          <View className="mt-4 items-center">
            {form.productPhoto ? (
              <Image
                source={{ uri: form.productPhoto }}
                className="w-48 h-48 rounded-md"
                resizeMode="cover"
              />
            ) : (
              <View className="w-48 h-48 bg-gray-200 rounded-md" />
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
            placeholder="Roti Ayam"
            onChangeText={(text) => setForm({ ...form, productName: text })}
            moreStyles="mt-7"
          />

          {/* Product Description Field */}
          <TextAreaField
            label="Deskripsi Produk"
            value={form.productDescription}
            placeholder="Roti Ayam merupakan roti lezat yang terbuat dari ayam..."
            onChangeText={(text) =>
              setForm({ ...form, productDescription: text })
            }
            moreStyles="mt-7"
          />

          {/* Category Dropdown */}
          <CustomDropdown
            label="Kategori"
            data={[
              { label: "Kategori1", value: "kategori1" },
              { label: "Kategori2", value: "kategori2" },
              { label: "Kategori3", value: "kategori3" },
            ]}
            value={form.category}
            placeholder="Pilih Kategori"
            labelField="label"
            valueField="value"
            onChange={(itemValue) => setForm({ ...form, category: itemValue })}
            moreStyles="mt-7"
          />

          {/* Date Picker Input */}
          <ExpirationDatePicker
            label="Tanggal Kedaluwarsa"
            expirationDate={form.expirationDate}
            onConfirm={handleDateConfirm}
            error={error}
          />

          {/* Initial Price Field */}
          <PriceInputField
            label="Harga Awal"
            value={form.initialPrice}
            onChangeText={(text) => setForm({ ...form, initialPrice: text })}
            placeholder="Masukkan Harga Awal"
            moreStyles="mt-7"
          />

          {/* Discount Fields */}
          <View className="mt-7 space-y-1">
            <TextFormLabel label="Potongan Harga" />
            <View className="flex-row justify-between">
              <View className="flex-1 mr-2">
                <DiscountInputField
                  value={form.discountDay1}
                  onChangeText={(text) =>
                    setForm({ ...form, discountDay1: text })
                  }
                  placeholder="Hari 1"
                />
              </View>

             
            </View>
          </View>

          {/* Stock Field */}
          <View className="mt-7 space-y-1">
            <TextFormLabel label="Jumlah Stok" />
            <View className="w-full h-[40px] flex-row items-center">
              <StockInput
                value={form.stock}
                onChangeText={(text) =>
                  setForm({ ...form, stock: parseInt(text) || 1 })
                }
              />
            </View>
          </View>

          {/* Add Product Button */}
          <CustomButton
            label="Tambahkan"
            handlePress={handleAddProduct}
            buttonStyles="mt-6"
            isLoading={isSubmitting}
          />

          {error && (
            <View className="mt-4 flex-row justify-center w-full">
              <Text style={{ color: "red" }}>{error}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateProduct;
