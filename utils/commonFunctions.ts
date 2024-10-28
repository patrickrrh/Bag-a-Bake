import * as EmailValidator from "email-validator";

export const checkEmptyForm = (
  form: Record<string, string | number | null>,
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
    bakeryRegionId: "Lokasi Toko",
    bakeryPhoneNumber: "Nomor HP Toko",
    bakeryDescription: "Deskripsi Toko",
    bakeryImage: "Gambar Toko",
  };

  for (const value in form) {
    if (value === "userImage") {
      continue;
    }

    const fieldLabel = fieldLabels[value] || value;

    if (form[value] === "" || form[value] === 0) {
      errors[value] = `${fieldLabel} tidak boleh kosong`;
    } else {
      if (value === "email") {
        if (!EmailValidator.validate(form[value] as string)) {
          errors[value] = `${fieldLabel} tidak valid`;
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
    errors.productPrice = `${fieldLabels.productPrice} harus minimal 1.000`;
  } else {
    errors.productPrice = null;
  }

  // Discounts

  errors.discount = null;
  
  if (Array.isArray(form.discount)) {
    const discountAmounts = form.discount.map(d => parseFloat(d.discountAmount));

    discountAmounts.forEach((amount, index) => {
      if (isNaN(amount) || amount < 0) {
        errors.discount = `Diskon ${index + 1} tidak boleh kurang dari 0`;
      } else {
        errors.discount 
      }

      if (index > 0 && amount < discountAmounts[index - 1]) {
        errors.discount = `Diskon ${index + 1} tidak boleh kurang dari Diskon ${index}`;
      }
    });
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
