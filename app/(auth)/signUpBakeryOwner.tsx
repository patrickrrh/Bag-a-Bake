import { View, Text, ScrollView, Image, Button } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomLogo from '@/components/CustomLogo'
import TextHeader from '@/components/texts/TextHeader'
import CustomButton from '@/components/CustomButton'
import ErrorMessage from '@/components/texts/ErrorMessage'
import TextHeadline from '@/components/texts/TextHeadline'
import { Link, router } from 'expo-router'
import TextLink from '@/components/texts/TextLink'
import FormField from '@/components/FormField'
import * as ImagePicker from 'expo-image-picker';
import UploadButton from '@/components/UploadButton'
import { images } from '@/constants/images'
import AuthLayout from './authLayout'
import { checkEmptyForm, encodeImage } from '@/utils/commonFunctions'
import ProgressBar from '@/components/ProgressBar'
import authenticationApi from '@/api/authenticationApi';
import { showToast } from '@/utils/toastUtils'
import BackButton from '@/components/BackButton'
import { requestNotificationPermission } from '@/utils/notificationUtils'
import * as FileSystem from 'expo-file-system';

type ErrorState = {
    userName: string | null;
    userPhoneNumber: string | null;
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
};

const SignUpBakeryOwner = () => {

    const [form, setForm] = useState({
        roleId: 2,
        userName: '',
        userPhoneNumber: '',
        email: '',
        password: '',
        userImage: '',
        pushToken: '-',
    })
    const [confirmPassword, setConfirmPassword] = useState('')

    const emptyError: ErrorState = {
        userName: null,
        userPhoneNumber: null,
        email: null,
        password: null,
        confirmPassword: null,
    }
    const [error, setError] = useState<ErrorState>(emptyError);

    const [isSubmitting, setisSubmitting] = useState(false);

    const handleSignUpAPI = async () => {
        try {
            setisSubmitting(true);
            setForm((prevForm) => ({ ...prevForm, userName: prevForm.userName.trim() }));
            const errors = checkEmptyForm(form, confirmPassword);
            if (Object.values(errors).some(error => error !== null)) {
                setError(errors as ErrorState);
                setisSubmitting(false);
                return;
            }
            if (form.password !== confirmPassword) {
                setError((prevError) => ({
                    ...prevError,
                    confirmPassword: 'Password tidak cocok',
                }));
                setisSubmitting(false);
                return;
            }

            const res = await authenticationApi().isEmailRegistered({
                email: form.email,
            })

            if (res.error) {
                showToast('error', res.error);
                return
            } else {
                let encodedUserImage = null;
                if (form.userImage !== '') {
                    encodedUserImage = await encodeImage(form.userImage)
                }
                const token = await requestNotificationPermission();
                if (token) {
                    form.pushToken = token.data
                }
                const otp = await authenticationApi().signUpOTP({
                    email: form.email,
                    userName: form.userName
                })
                const updatedForm = { ...form, userImage: encodedUserImage };
                if (otp.status === 200) {
                    router.push({
                        pathname: '/(auth)/signUpOTP' as any,
                        params: { email: form.email, userDataForm: JSON.stringify(updatedForm) },
                    })
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setisSubmitting(false);
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })

        if (!result.canceled) {
            setForm({ ...form, userImage: result.assets[0].uri })
        }
    };

    const headerContent = (
        <View className="flex-row">
            <BackButton />
            <View className="flex-1 items-center pr-3 pb-5">
                <TextHeader label="Daftar Akun" />
            </View>
        </View>
    )

    const footerContent = (
        <>
            <View className='mr-1'>
                <TextHeadline label='Sudah memiliki akun?' />
            </View>
            <TextLink label="Masuk disini" size={14} onPress={() => router.push('/(auth)/signIn')} />
        </>
    );

    return (
        <AuthLayout headerContent={headerContent} footerContent={footerContent} isScrollable>
            <View className="w-full items-center">
                {form.userImage ? (
                    <View className="w-24 h-24 border border-gray-200 rounded-full mb-4">
                        <Image
                            source={{ uri: form.userImage }}
                            className="w-full h-full rounded-full"
                        />
                    </View>
                ) : (
                    <View className="w-24 h-24 border border-gray-200 rounded-full mb-4">
                        <Image
                            source={images.profile}
                            className="w-full h-full rounded-full"
                            resizeMode='cover'
                        />
                    </View>
                )}
                <UploadButton label="Unggah Foto" handlePress={pickImage} />
            </View>

            <FormField
                label='Nama Pengguna'
                value={form.userName}
                onChangeText={(text) => {
                    setForm({ ...form, userName: text });
                    setError((prevError) => ({ ...prevError, userName: null }));
                }}
                keyboardType='default'
                moreStyles='mt-7'
                error={error.userName}
                placeholder='Masukkan nama'
            />
            <FormField
                label='Nomor Telepon'
                value={form.userPhoneNumber}
                onChangeText={(text) => {
                    setForm({ ...form, userPhoneNumber: text });
                    setError((prevError) => ({ ...prevError, userPhoneNumber: null }));
                }}
                keyboardType='phone-pad'
                moreStyles='mt-7'
                error={error.userPhoneNumber}
                placeholder='Masukkan nomor telepon'
            />
            <FormField
                label='Email'
                value={form.email}
                onChangeText={(text) => {
                    setForm({ ...form, email: text });
                    setError((prevError) => ({ ...prevError, email: null }));
                }}
                keyboardType='email-address'
                moreStyles='mt-7'
                error={error.email}
                placeholder='Masukkan email'
            />
            <FormField
                label='Kata Sandi'
                value={form.password}
                onChangeText={(text) => {
                    setForm({ ...form, password: text });
                    setError((prevError) => ({ ...prevError, password: null }));
                }}
                keyboardType='default'
                moreStyles='mt-7'
                error={error.password}
                placeholder='Masukkan kata sandi'
            />
            <FormField
                label='Konfirmasi Kata Sandi'
                value={confirmPassword}
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    setError((prevError) => ({ ...prevError, confirmPassword: null }));
                }}
                keyboardType='default'
                moreStyles='mt-7'
                error={error.confirmPassword}
                placeholder='Konfirmasi kata sandi'
            />

            <CustomButton
                label='Daftar'
                handlePress={() => handleSignUpAPI()}
                buttonStyles='mt-10 w-full'
                isLoading={isSubmitting}
            />

        </AuthLayout>
    )
}

export default SignUpBakeryOwner