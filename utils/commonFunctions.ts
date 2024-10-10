import * as EmailValidator from 'email-validator';

export const checkEmptyForm = (form: Record<string, string | number | null>, confirmPassword?: string) => {
    const errors: Record<string, string | null> = {};

    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{6,10}$/;

    const fieldLabels: Record<string, string> = {
        userName: 'Nama Pengguna',
        email: 'Email',
        password: 'Password',
        userPhoneNumber: 'Nomor HP',
        regionId: 'Lokasi',
        openingTime: 'Jam Buka',
        closingTime: 'Jam Tutup',
        bakeryName: 'Nama Toko',
        bakeryRegionId: 'Lokasi Toko',
        bakeryPhoneNumber: 'Nomor HP Toko',
        bakeryDescription: 'Deskripsi Toko',
        bakeryImage: 'Gambar Toko',
      };

    for (const value in form) {

        if (value === 'userImage') {
            continue;
        }

        const fieldLabel = fieldLabels[value] || value;

        if (form[value] === '' || form[value] === 0) {
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
                    errors[value] = `${fieldLabel} minimal 8 karakter & 1 karakter spesial`;
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

    if (confirmPassword === '') {
        errors.confirmPassword = 'Konfirmasi Password tidak boleh kosong';
    } else {
        errors.confirmPassword = null;
    }

    return errors;
}