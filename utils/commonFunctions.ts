export const checkEmptyForm = (form: Record<string, string | number | null>, confirmPassword?: string) => {
    const errors: Record<string, string | null> = {};

    for (const value in form) {

        if (value === 'userImage') {
            continue;
        }

        if (form[value] === '' || form[value] === 0) {
            errors[value] = `${value} tidak boleh kosong`;
        } else {
            errors[value] = null
        }
    }

    if (confirmPassword === '') {
        errors.confirmPassword = 'Konfirmasi Password tidak boleh kosong';
    } else {
        errors.confirmPassword = null;
    }

    return errors;
}