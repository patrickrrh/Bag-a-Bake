import {
  View,
  Text,
  Image,
  ScrollView,
  Keyboard
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "@/components/CustomButton";
import BackButton from "@/components/BackButton";
import FormField from "@/components/FormField";
import UploadButton from "@/components/UploadButton";
import StockInput from "@/components/StockInput";
import TextAreaField from "@/components/TextAreaField";
import CustomDropdown from "@/components/CustomDropdown";
import TextTitle3 from "@/components/texts/TextTitle3";
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
import { useAuth } from "@/app/context/AuthContext";
import Decimal from "decimal.js";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ModalInformation from "@/components/ModalInformation";

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

type DiscountItem = {
  discountAmount: string;
  discountDate: string;
};

const CreateProduct = () => {
  const insets = useSafeAreaInsets();
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
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);

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

  const handleFillMissingDiscounts = () => {
    setForm((prevForm) => {
      if (!prevForm.discount || prevForm.discount.length === 0) {
        console.log("No discounts available to update.");
        return prevForm;
      }

      const filledDiscounts = prevForm.discount.map((discount, index) => {
        if (
          discount.discountAmount === "" ||
          discount.discountAmount === null
        ) {
          const lastFilledDiscount = prevForm.discount
            .slice(0, index)
            .reverse()
            .find((d) => d.discountAmount !== "" && d.discountAmount !== null);

          const lastDiscountAmount = lastFilledDiscount
            ? lastFilledDiscount.discountAmount
            : "";

          return {
            ...discount,
            discountAmount: lastDiscountAmount,
          };
        }

        return discount;
      });

      return { ...prevForm, discount: filledDiscounts };
    });
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

      const hasMissingDiscounts = form.discount.some(
        (disc) => !disc.discountAmount
      );
      if (hasMissingDiscounts) {
        setIsDiscountModalVisible(true);
        return;
      } else {
        console.log("masuk else");
        setIsConfirmationModalVisible(true);
        return;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
      Keyboard.dismiss();
    }
  };

  const saveProduct = async () => {
    try {
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

      console.log("Response:", response);
      console.log("Form submitted:", form);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsConfirmationModalVisible(false);
      setModalVisible(true);
    }
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

  useEffect(() => {
    const fillDiscountFields = () => {
      const today = dayjs().startOf("day");
      const expirationDate = dayjs(form.productExpirationDate).startOf("day");
      const daysToExpiration = expirationDate.diff(today, "day");

      const existingDiscounts = form.discount || [];

      const newDiscounts: DiscountItem[] = [];

      for (let i = 0; i <= daysToExpiration; i++) {
        const discountDate = today.add(i, "day").toDate();
        const discountDateString = discountDate.toISOString();

        const existingDiscount = existingDiscounts.find(
          (discount) => discount.discountDate === discountDateString
        );

        if (existingDiscount) {
          newDiscounts.push(existingDiscount);
        } else {
          newDiscounts.push({
            discountAmount: "",
            discountDate: discountDateString,
          });
        }
      }

      const updatedDiscounts = newDiscounts;

      setForm((prevForm) => ({
        ...prevForm,
        discount: updatedDiscounts,
      }));
    };

    fillDiscountFields();
  }, [form.productExpirationDate]);

  return (
    <View className="bg-background h-full flex-1">

      <View
        style={{
          backgroundColor: "#FEFAF9",
          height: insets.top,
        }}
      />

      <View className="flex-row items-center px-4 pb-2 relative">
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
                justifyContent: "flex-start",
                marginBottom: 10,
              }}
            >
              <TextFormLabel label="Harga Jual" />
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="black"
                style={{ marginLeft: 2 }}
                onPress={() => setIsInfoModalVisible(true)}
              />

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
                    Hari ke-{index + 1}{" "}
                    <Text style={{ fontSize: 12 }}>
                      ({dayjs(discount.discountDate).format("D MMM")})
                    </Text>
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
          <View className="mt-1 space-y-1">
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
            buttonStyles="mt-10 mb-5"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>

      {isDiscountModalVisible && (
        <ModalAction
          modalVisible={isDiscountModalVisible}
          setModalVisible={setIsDiscountModalVisible}
          title="Apakah Anda ingin mengisi diskon otomatis?"
          primaryButtonLabel="Iya"
          secondaryButtonLabel="Tidak"
          onPrimaryAction={() => {
            handleFillMissingDiscounts();
            setIsDiscountModalVisible(false);
            // handleAddProduct();
          }}
          onSecondaryAction={() => {
            setIsDiscountModalVisible(false);
          }}
        />
      )}

      {isConfirmationModalVisible && (
        <ModalAction
          modalVisible={isConfirmationModalVisible}
          setModalVisible={setIsConfirmationModalVisible}
          title="Apakah Anda yakin ingin menambahkan produk?"
          primaryButtonLabel="Iya"
          secondaryButtonLabel="Tidak"
          onPrimaryAction={() => {
            saveProduct();
            setIsConfirmationModalVisible(false);
          }}
          onSecondaryAction={() => {
            setIsConfirmationModalVisible(false);
          }}
        />
      )}
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
      {isInfoModalVisible && (
        <ModalInformation
          visible={isInfoModalVisible}
          onClose={() => setIsInfoModalVisible(false)}
          title="Harga Jual"
          content="Harga Jual adalah harga produk setelah dikurangi diskon per hari, dengan hari pertama dihitung mulai dari hari ini."
        />
      )}
    </View>
  );
};

export default CreateProduct;
