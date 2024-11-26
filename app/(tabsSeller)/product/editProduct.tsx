import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
  Keyboard
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
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
import ModalAction from "@/components/ModalAction";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ModalInformation from "@/components/ModalInformation";
import { showToast } from "@/utils/toastUtils";

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

type RouteParams = {
  productId: number;
};

type DiscountItem = {
  discountAmount: string;
  discountDate: string;
};

const EditProduct = () => {
  const insets = useSafeAreaInsets();
  const { userData } = useAuth();
  const { productId } = useLocalSearchParams();

  const [form, setForm] = useState({
    productId: 0,
    productName: "",
    productDescription: "",
    categoryId: 0,
    productExpirationDate: new Date(),
    productPrice: "",
    discount: [{ discountAmount: "", discountDate: new Date().toISOString() }],
    productStock: 1,
    productImage: "",
    bakeryId: 0,
    isActive: 1,
  });

  const [isSwitchEnabled, setIsSwitchEnabled] = useState(form.isActive === 1);

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
    setIsExpirationDateUpdated(true);
    setError((prevError) => ({ ...prevError, productExpirationDate: null }));
  };

  const handleEditProduct = async () => {
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
        productId: new Number(form.productId),
        productPrice: new Decimal(form.productPrice),
        productExpirationDate: new Date(form.productExpirationDate),
        discount: form.discount.map((disc) => ({
          ...disc,
          discountAmount: new Decimal(disc.discountAmount),
          discountDate: new Date(disc.discountDate),
        })),
      };

      const response = await productApi().updateProductById(formData);
      console.log("response", response);
      if (response.error) {
        throw new Error(response.error);
      }
      
      showToast("success", "Produk berhasil diperbarui!");
      router.back();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsConfirmationModalVisible(false);
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

  const handleGetProductById = async () => {
    try {
      const response = await productApi().getProductById({ productId });
      console.log("product id", productId);
      console.log(response.data);
      if (response.status === 200) {
        setForm({
          productId: response.data.productId,
          productName: response.data.productName,
          productDescription: response.data.productDescription,
          categoryId: response.data.categoryId,
          productExpirationDate: new Date(response.data.productExpirationDate),
          productPrice: response.data.productPrice.toString(),
          discount:
            response.data.discount && response.data.discount.length > 0
              ? response.data.discount.map(
                (discount: {
                  discountAmount: string;
                  discountDate: string;
                }) => ({
                  discountAmount: discount.discountAmount.toString(),
                  discountDate:
                    discount.discountDate || new Date().toISOString(),
                })
              )
              : [
                {
                  discountAmount: "",
                  discountDate: new Date().toISOString(),
                },
              ],
          productStock: response.data.productStock,
          productImage: response.data.productImage,
          bakeryId: response.data.bakeryId,
          isActive: response.data.isActive,
        });
        setIsSwitchEnabled(response.data.isActive === 1);
      }
      console.log(form);
    } catch (error) {
      console.log("Error fetching product by ID:", error);
    }
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

  useEffect(() => {
    const today = dayjs().startOf("day");
    const expirationDate = dayjs(form.productExpirationDate).startOf("day");

    if (expirationDate.isBefore(today)) {
      setIsSwitchEnabled(false);
      setForm((prevForm) => ({
        ...prevForm,
        isActive: 2,
      }));
    }
  }, [form.productExpirationDate]);

  const handleToggleSwitch = () => {
    const today = dayjs().startOf("day");
    const expirationDate = dayjs(form.productExpirationDate).startOf("day");

    if (expirationDate.isBefore(today)) {
      return;
    }

    setIsSwitchEnabled((previousState) => !previousState);
    setForm((prevForm) => ({
      ...prevForm,
      isActive: isSwitchEnabled ? 2 : 1,
    }));
  };

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDeleteProduct = async () => {
    try {
      await productApi().deleteProductById({ productId });
      router.push("/product");
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const confirmDelete = () => {
    setDeleteModalVisible(true);
  };

  useEffect(() => {
    handleGetCategoriesAPI();
    handleGetProductById();
  }, [productId]);

  const [isExpirationDateUpdated, setIsExpirationDateUpdated] = useState(false);

  useEffect(() => {
    if (isExpirationDateUpdated) {
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
      setIsExpirationDateUpdated(false);
    }
  }, [form.productExpirationDate, isExpirationDateUpdated]);

  return (
    <View className="bg-background h-full flex-1">

      <View
        style={{
          backgroundColor: "#FEFAF9",
          height: insets.top,
        }}
      />

      <View className="flex-row items-center px-4 mb-5 relative">
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
          <TextTitle3 label="Perbarui Produk" />
        </View>

        <TouchableOpacity
          onPress={confirmDelete}
          style={{ position: "absolute", right: 32 }}
        >
          <Ionicons name="trash-outline" size={24} color="#b0795a" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ paddingHorizontal: 20, flex: 1 }}>
          {/* Preview Upload Photo */}
          <View className="items-center">
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
          <View className="mb-4 w-full items-center">
            {error.productImage && <ErrorMessage label={error.productImage} />}
          </View>
          {/* Upload Photo Button */}
          <View className="w-full items-center">
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
            placeholder="Roti keju"
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
            placeholder="Roti yang dibuat menggunakan keju premium..."
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
            value={form.categoryId}
            placeholder="Pilih Kategori"
            labelField="categoryName"
            valueField="categoryId"
            onChange={(text) => {
              setForm({ ...form, categoryId: Number(text) });
              setError((prevError) => ({ ...prevError, categoryId: null }));
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
              {/* <View
                style={{
                  flexDirection: "row",
                  marginLeft: 10,
                }}
              >
                <SquareButton label="-" handlePress={handleRemoveDiscount} />
                <SquareButton label="+" handlePress={handleAddDiscount} />
              </View> */}
            </View>

            <ModalInformation
              visible={isInfoModalVisible}
              onClose={() => setIsInfoModalVisible(false)}
              title="Harga Jual"
              content="Harga Jual adalah harga produk setelah dikurangi diskon per hari, dengan hari pertama dihitung mulai dari hari ini."
            />
            <View className="flex-col">
              {form.discount.map((discount, index) => {
                const discountDate = dayjs(discount.discountDate);
                const isPast = discountDate.isBefore(dayjs(), "day");

                return (
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
                      editable={!isPast}
                    />
                  </View>
                );
              })}
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

          {/* Status Switch */}
          <View className="mt-7 space-y-1">
            <TextFormLabel label="Status Produk" />
            <View className="w-full h-[40px] flex-row items-center">
              <Text
                style={{
                  fontFamily: "poppinsRegular",
                  fontSize: 14,
                  color: "black",
                }}
              >
                Inactive
              </Text>
              <Switch
                value={isSwitchEnabled}
                onValueChange={handleToggleSwitch}
                trackColor={{
                  false: "#D3D3D3",
                  true: "#D6B09F",
                }}
                thumbColor={isSwitchEnabled ? "#b0795a" : "gray"}
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                }}
              />

              <Text
                style={{
                  fontFamily: "poppinsRegular",
                  fontSize: 14,
                  color: "black",
                }}
              >
                Active
              </Text>
            </View>
          </View>

          {/* Add Product Button */}
          <CustomButton
            label="Perbarui"
            handlePress={handleEditProduct}
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
          title="Apakah Anda yakin ingin mengubah produk?"
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

      {isDeleteModalVisible && (
        <ModalAction
          setModalVisible={setDeleteModalVisible}
          modalVisible={isDeleteModalVisible}
          title="Apakah Anda yakin ingin menghapus produk ini?"
          primaryButtonLabel="Batal"
          secondaryButtonLabel="Hapus Produk"
          onSecondaryAction={() => {
            handleDeleteProduct();
          }}
          onPrimaryAction={() => { }}
        />
      )}
    </View>
  );
};

export default EditProduct;
