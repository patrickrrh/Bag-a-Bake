import { UserImageType } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as EmailValidator from "email-validator";
import { ExpoPushToken } from "expo-notifications";
import * as FileSystem from 'expo-file-system';

export const checkEmptyForm = (
  form: Record<string, string | number | ExpoPushToken | null | UserImageType | undefined>,
  confirmPassword?: string
) => {
  const errors: Record<string, string | null> = {};

  const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{6,10}$/;

  const fieldLabels: Record<string, string> = {
    userName: "Nama Pengguna",
    email: "Email",
    password: "Password",
    userPhoneNumber: "Nomor HP",
    regionId: "Lokasi",
    openingTime: "Jam Buka",
    closingTime: "Jam Tutup",
    bakeryName: "Nama Toko",
    bakeryAddress: "Alamat Toko",
    bakeryPhoneNumber: "Nomor HP Toko",
    bakeryDescription: "Deskripsi Toko",
    bakeryImage: "Gambar Toko",
    address: "Alamat",
    halalCertificate: "Sertifikat Halal",
  };

  for (const value in form) {
    if (value === "userImage") {
      continue;
    }

    const fieldLabel = fieldLabels[value] || value;

    if ((value === "halalCertificate" || value === "isHalal") && (form.isHalal === 0)) {
      continue;
    }

    if (form[value] === "" || form[value] === 0) {
      errors[value] = `${fieldLabel} tidak boleh kosong`;
    } else {
      if (value === "email") {
        if (!EmailValidator.validate(form[value] as string)) {
          errors[value] = `${fieldLabel} tidak valid`;
        } else {
          errors[value] = null;
        }
      } else if (value === "userName") {
        if ((form[value] as string).length < 3) {
          errors[value] = `${fieldLabel} tidak boleh kurang dari 3 huruf`;
        } else if ((form[value] as string).length > 20) {
          errors[value] = `${fieldLabel} tidak boleh lebih dari 20 huruf`;
        } else if (!/^[a-zA-Z\s]+$/.test(form[value] as string)) {
          errors[value] = `${fieldLabel} hanya boleh terdiri dari huruf`;
        } else if (/\s{2,}/.test(form[value] as string)) {
          errors[value] = `${fieldLabel} tidak boleh mengandung spasi ganda`;
        } else {
          errors[value] = null;
        }
      } else if (value === "password") {
        if (!passwordRegex.test(form[value] as string)) {
          errors[
            value
          ] = `${fieldLabel} minimal 8 karakter & 1 karakter spesial`;
        } else {
          errors[value] = null;
        }
      } else if (value === "userPhoneNumber") {
        if (!phoneRegex.test(form[value] as string)) {
          errors[value] = `${fieldLabel} tidak valid`;
        } else {
          errors[value] = null;
        }
      } else if (value === "bakeryPhoneNumber") {
        if (!phoneRegex.test(form[value] as string)) {
          errors[value] = `${fieldLabel} tidak valid`;
        } else {
          errors[value] = null;
        }
      } else if (value === "bakeryName") {
        if ((form[value] as string).length < 3) {
          errors[value] = `${fieldLabel} tidak boleh kurang dari 3 huruf`;
        } else if ((form[value] as string).length > 50) {
          errors[value] = `${fieldLabel} tidak boleh lebih dari 50 huruf`;
        } else {
          errors[value] = null;
        }
      } else if (value === "bakeryImage") {
        if (!form[value]) {
          errors[value] = `${fieldLabel} harus diunggah`;
        } else {
          errors[value] = null;
        }
      } else if (value === "bakeryDescription") {
        const wordCount = (form[value] as string).trim().split(/\s+/).length;
        if (wordCount < 5) {
          errors[value] = `${fieldLabel} harus minimal 5 kata`;
        } else if (wordCount > 50) {
          errors[value] = `${fieldLabel} tidak boleh lebih dari 50 kata`;
        } else {
          errors[value] = null;
        }
      } else if (value === "openingTime" || value === "closingTime") {
        if (form.openingTime && form.closingTime) {
          const openingTime = new Date(`1970-01-01T${form.openingTime}:00`);
          const closingTime = new Date(`1970-01-01T${form.closingTime}:00`);
          if (openingTime >= closingTime) {
            errors.openingTime = "Jam Buka harus lebih awal dari Jam Tutup";
            errors.closingTime = "Jam Tutup harus lebih lambat dari Jam Buka";
          } else {
            errors.openingTime = null;
            errors.closingTime = null;
          }
        }
      } else {
        errors[value] = null;
      }
    }
  }

  if (confirmPassword === "") {
    errors.confirmPassword = "Konfirmasi Password tidak boleh kosong";
  } else {
    errors.confirmPassword = null;
  }

  return errors;
};

export const checkProductForm = (form: Record<string, unknown>) => {
  const errors: Record<string, string | null> = {};

  const fieldLabels: Record<string, string> = {
    productName: "Nama Produk",
    productDescription: "Deskripsi Produk",
    category: "Kategori",
    productExpirationDate: "Tanggal Kedaluwarsa",
    productPrice: "Harga Awal",
    productStock: "Stok Produk",
    productImage: "Foto Produk",
  };

  // Product Name
  if (
    form.productName === "" ||
    (form.productName as string).length < 3 ||
    (form.productName as string).length > 20
  ) {
    errors.productName = `${fieldLabels.productName} harus memiliki antara 3 hingga 20 karakter`;
  } else {
    errors.productName = null;
  }

  // Product Description
  const wordCount = (form.productDescription as string)
    .trim()
    .split(/\s+/).length;
  if (wordCount < 5 || wordCount > 50) {
    errors.productDescription = `${fieldLabels.productDescription} harus memiliki antara 5 hingga 50 kata`;
  } else {
    errors.productDescription = null;
  }

  // Category
  if (form.categoryId == 0) {
    errors.category = `${fieldLabels.category} harus dipilih`;
  } else {
    errors.category = null;
  }

  // Expiration Date
  if (!form.productExpirationDate) {
    errors.productExpirationDate = `${fieldLabels.productExpirationDate} harus dipilih`;
  } else {
    errors.productExpirationDate = null;
  }

  // Initial Price
  if (form.productPrice === "" || (form.productPrice as number) < 1000) {
    errors.productPrice = `${fieldLabels.productPrice} harus minimal Rp1.000`;
  } else {
    errors.productPrice = null;
  }

  // Discounts

  errors.discount = null;

  if (Array.isArray(form.discount)) {
    const discountAmounts = form.discount.map((d) =>
      parseFloat(d.discountAmount)
    );

    if (!discountAmounts[0] || discountAmounts[0] == null) {
      errors.discount = `Harga Hari ke-1 tidak boleh kosong`;
    } else if (discountAmounts[0] >= (form.productPrice as number)) {
      errors.discount = `Harga Hari ke-1 tidak boleh lebih besar atau sama dengan Harga Awal`;
    } else {
      const discountPercentage = (((form.productPrice as number) - discountAmounts[0]) / (form.productPrice as number)) * 100;

      if (discountPercentage < 10) {
        errors.discount = `Harga Hari ke-1 harus minimal 10% dari Harga Awal`;
      }
    }

    discountAmounts.forEach((amount, index) => {
      if (index > 0 && amount > discountAmounts[index - 1]) {
        errors.discount = `Harga Hari ke-${index + 1
          } harus lebih kecil atau sama dengan Diskon ${index}`;
      }
    });

    if (!errors.discount) {
      errors.discount = null;
    }

  } else {
    errors.discount = "Diskon tidak valid";
  }

  // Product Photo
  if (!form.productImage) {
    errors.productImage = `${fieldLabels.productImage} harus diunggah`;
  } else {
    errors.productImage = null;
  }

  return errors;
};

export const calculateTotalOrderPrice = (orderDetail: any): string => {
  const total = orderDetail.reduce((sum: number, detail: any) => {
    const price = parseFloat(detail.product.todayPrice);
    console.log("Price: ", price);
    return sum + price * detail.productQuantity;
  }, 0);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(total);
};

export const calculateTotalOrderItem = (orderDetail: any): number => {
  const total = orderDetail.reduce((sum: number, detail: any) => {
    return sum + detail.productQuantity;
  }, 0);

  return total;
};

export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

export const formatDate = (date: string) => {
  const dateObj = new Date(date);
  const options: any = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: false,
  };
  return dateObj.toLocaleString("id-ID", options);
};

export const formatDatewithtime = (date: string) => {
  const dateObj = new Date(date);
  const options: any = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };
  return dateObj.toLocaleString("id-ID", options);
};

export const calculateValidPaymentTime = (date: string) => {
  const dateObj = new Date(date);

  dateObj.setMinutes(dateObj.getMinutes() + 15);

  const currentSeconds = dateObj.getSeconds();

  const secondsToAdd = currentSeconds === 0 ? 0 : 60 - currentSeconds;

  dateObj.setSeconds(dateObj.getSeconds() + secondsToAdd);

  const options: any = {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  return dateObj.toLocaleString("id-ID", options);
};

export const setLocalStorage = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log("Failed to set local storage:", error);
  }
};

export const getLocalStorage = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log("Failed to get local storage:", error);
  }
};

export const removeLocalStorage = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log("Failed to remove local storage:", error);
  }
};

export const checkPasswordErrors = async (
  form: Record<string, string>,
  confirmPassword: string,
  userEmail: string,
  authenticationApi: any
) => {
  const errors: Record<string, string | null> = {};
  const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (!form.oldPassword) {
    errors.oldPassword = "Password lama tidak boleh kosong";
  } else {
    const resCheck = await authenticationApi().checkAccount({
      email: userEmail,
      password: form.oldPassword,
    });

    if (resCheck.error) {
      errors.oldPassword = "Password lama tidak valid";
    } else if (!form.password) {
      errors.password = "Password baru tidak boleh kosong";
    } else if (!passwordRegex.test(form.password)) {
      errors.password = "Password baru minimal 8 karakter & 1 karakter spesial";
    } else if (form.oldPassword === form.password) {
      errors.password = "Password baru tidak boleh sama dengan password lama";
    } else if (form.password !== confirmPassword) {
      errors.confirmPassword = "Password tidak cocok";
    } else {
      errors.password = null;
      errors.confirmPassword = null;
    }
  }

  return errors;
};

export const updateLocalStorage = async <T>(
  key: string,
  value: T,
  updateFunction: (data: T[], value: T) => T[]
) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    const data = jsonValue ? JSON.parse(jsonValue) : [];

    // Apply the custom update logic provided by the updateFunction
    const updatedData = updateFunction(data, value);

    // Store the updated data back in AsyncStorage
    await AsyncStorage.setItem(key, JSON.stringify(updatedData));
  } catch (error) {
    console.log("Failed to update local storage:", error);
  }
};

export const convertPhoneNumberFormat = (phoneNumber: string): string => {
  if (phoneNumber.startsWith("0")) {
    return `62${phoneNumber.slice(1)}`;
  }
  return phoneNumber;
};

export const encodeImage = async (imageUri: string | null) => {
  if (!imageUri) return null;

  try {
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64Image;
  } catch (error) {
    console.log("Failed to encode image:", error);
    return null;
  }
};