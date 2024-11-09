import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "@/components/CustomButton";
import BackButton from "@/components/BackButton";
import FormField from "@/components/FormField";
import UploadButton from "@/components/UploadButton";
import StockInput from "@/components/StockInput";
import TextAreaField from "@/components/TextAreaField";
import CustomDropdown from "@/components/CustomDropdown";
import TextTitle3 from "@/components/texts/TextTitle3";
import ModalSubmission from "@/components/ModalSubmission";
import ModalAction from "@/components/ModalAction";
import dayjs from "dayjs";
import TextFormLabel from "@/components/texts/TextFormLabel";
import ExpirationDatePicker from "@/components/ExpirationDatePicker";
import PriceInputField from "@/components/PriceInputField";
import DiscountInputField from "@/components/DiscountInputField";
import { checkProductForm } from "@/utils/commonFunctions";
import ErrorMessage from "@/components/texts/ErrorMessage";
import categoryApi from "@/api/categoryApi";
import productApi from "@/api/productApi";
import SquareButton from "@/components/SquareButton";
import { useAuth } from "@/app/context/AuthContext";
import Decimal from "decimal.js";
import { router } from "expo-router";

type ErrorState = {
  productName: string | null;
  productDescription: string | null;
  category: string | null;
  productExpirationDate: string | null;
  productPrice: string | null;
  discount: string | null;
  productStock: string | null;
  productImage: string | null;
};

const CreateProduct = () => {
  const { userData } = useAuth();

  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    categoryId: 0,
    category: "",
    productExpirationDate: new Date(),
    productPrice: "",
    discount: [{ discountAmount: "", discountDate: new Date().toISOString() }],
    productStock: 1,
    productImage: "",
    bakeryId: 0,
  });

  const productError: ErrorState = {
    productName: null,
    productDescription: null,
    category: null,
    productExpirationDate: null,
    productPrice: null,
    discount: null,
    productStock: null,
    productImage: null,
  };

  const [error, setError] = useState<ErrorState>(productError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, productImage: result.assets[0].uri });
    }
  };

  dayjs.locale("id");
  const handleDateConfirm = (date: Date) => {
    setForm({
      ...form,
      productExpirationDate: date,
    });
    setError((prevError) => ({ ...prevError, productExpirationDate: null }));
  };

  const handleAddProduct = async () => {
    try {
      setIsSubmitting(true);
      form.bakeryId = userData?.bakery.bakeryId ?? 0;
      const errors = checkProductForm(form);
      if (Object.values(errors).some((error) => error !== null)) {
        setError(errors as ErrorState);
        return;
      }
      console.log(form);
      const formData = {
        ...form,
        productPrice: new Decimal(form.productPrice),
        productExpirationDate: new Date(form.productExpirationDate),
        discount: form.discount.map((disc) => ({
          ...disc,
          discountAmount: new Decimal(disc.discountAmount),
          discountDate: new Date(disc.discountDate),
        })),
      };

      const response = await productApi().createProduct(formData);
      if (response.error) {
        throw new Error(response.error);
      }
      setModalVisible(true);
      console.log("Response:", response);
      console.log("Form submitted:", form);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDiscount = () => {
    setForm((prevForm) => {
      const newDiscountDate = new Date();
      newDiscountDate.setDate(
        newDiscountDate.getDate() + prevForm.discount.length
      );

      return {
        ...prevForm,
        discount: [
          ...prevForm.discount,
          { discountAmount: "", discountDate: newDiscountDate.toISOString() },
        ],
      };
    });
  };

  const handleRemoveDiscount = () => {
    setForm((prevForm) => {
      const updatedDiscounts = prevForm.discount.slice(0, -1);

      if (updatedDiscounts.length < 1) {
        const newDiscountDate = new Date();
        newDiscountDate.setDate(newDiscountDate.getDate());
        
        updatedDiscounts.push({
          discountAmount: "",
          discountDate: newDiscountDate.toISOString(),
        });
      }

      return {
        ...prevForm,
        discount: updatedDiscounts,
      };
    });
  };

  const handleDiscountChange = (index: number, text: string) => {
    const updatedDiscounts = form.discount.map((discount, i) =>
      i === index ? { ...discount, discountAmount: text } : discount
    );

    setForm((prevForm) => ({
      ...prevForm,
      discount: updatedDiscounts,
    }));
  };

  const [categories, setCategories] = useState([]);

  const handleGetCategoriesAPI = async () => {
    try {
      const response = await categoryApi().getCategory();
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetCategoriesAPI();
  }, []);

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
            {form.productImage ? (
              <Image
                source={{ uri: form.productImage }}
                className="w-48 h-48 rounded-md"
                resizeMode="cover"
              />
            ) : (
              <View className="w-48 h-48 bg-gray-200 rounded-md" />
            )}
          </View>
          <View className="mt-4 w-full items-center">
            {error.productImage && <ErrorMessage label={error.productImage} />}
          </View>
          {/* Upload Photo Button */}
          <View className="mt-4 w-full items-center">
            <UploadButton
              label="Unggah Foto"
              handlePress={() => {
                setError((prevError) => ({ ...prevError, productImage: null }));
                pickImage();
              }}
            />
          </View>

          {/* Product Name Field */}
          <FormField
            label="Nama Produk"
            value={form.productName}
            placeholder="Roti Ayam"
            onChangeText={(text) => {
              setForm({ ...form, productName: text });
              setError((prevError) => ({ ...prevError, productName: null }));
            }}
            moreStyles="mt-7"
            error={error.productName}
          />

          {/* Product Description Field */}
          <TextAreaField
            label="Deskripsi Produk"
            value={form.productDescription}
            placeholder="Roti Ayam merupakan roti lezat yang terbuat dari ayam..."
            onChangeText={(text) => {
              setForm({ ...form, productDescription: text });
              setError((prevError) => ({
                ...prevError,
                productDescription: null,
              }));
            }}
            moreStyles="mt-7"
            error={error.productDescription}
          />

          <CustomDropdown
            label="Kategori"
            data={categories}
            value={form.category}
            placeholder="Pilih Kategori"
            labelField="categoryName"
            valueField="categoryId"
            onChange={(text) => {
              setForm({ ...form, categoryId: Number(text) });
              setError((prevError) => ({ ...prevError, category: null }));
            }}
            moreStyles="mt-7"
            error={error.category}
          />

          {/* Date Picker Input */}
          <ExpirationDatePicker
            label="Tanggal Kedaluwarsa"
            expirationDate={dayjs(form.productExpirationDate).format(
              "DD MMMM YYYY"
            )}
            onConfirm={handleDateConfirm}
            error={error.productExpirationDate}
          />

          {/* Initial Price Field */}
          <PriceInputField
            label="Harga Awal"
            value={form.productPrice}
            onChangeText={(text) => setForm({ ...form, productPrice: text })}
            placeholder="Masukkan Harga Awal"
            moreStyles="mt-7"
            error={error.productPrice}
          />

          {/* Discount Fields */}
          <View className="mt-7 space-y-1">
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <TextFormLabel label="Harga Jual" />
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 10,
                }}
              >
                <SquareButton label="-" handlePress={handleRemoveDiscount} />
                <SquareButton label="+" handlePress={handleAddDiscount} />
              </View>
            </View>
            <View className="flex-col">
              {form.discount.map((discount, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between mb-4"
                >
                  <Text
                    style={{ fontFamily: "poppinsRegular", fontSize: 14 }}
                    className="text-black"
                  >
                    Hari ke-{index + 1}
                  </Text>
                  <DiscountInputField
                    value={discount.discountAmount}
                    onChangeText={(text) => handleDiscountChange(index, text)}
                    placeholder={`Hari ke-${index + 1}`}
                  />
                </View>
              ))}
            </View>

            <View className="mt-4 flex-col justify-center w-full">
              {error.discount && <ErrorMessage label={error.discount} />}
            </View>
          </View>

          {/* Stock Field */}
          <View className="mt-7 space-y-1">
            <TextFormLabel label="Jumlah Stok" />
            <View className="w-full h-[40px] flex-row items-center">
              <StockInput
                value={form.productStock}
                onChangeText={(text) =>
                  setForm({ ...form, productStock: parseInt(text) || 1 })
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
        </View>
      </ScrollView>

      {/* {modalVisible && <ModalSubmission setModalVisible={setModalVisible} modalVisible={modalVisible} />} */}

      {modalVisible && (
        <ModalAction
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          title="Produk berhasil ditambahkan!"
          primaryButtonLabel="Tambah Produk Lagi"
          secondaryButtonLabel="Kembali ke Daftar Produk"
          onPrimaryAction={() => router.push("/product/createProduct")}
          onSecondaryAction={() => router.push("/product")}
        />
      )}

    </SafeAreaView>
  );
};

export default CreateProduct;
