import { View, Text, ScrollView, Image, Button } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
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
import { useAuth } from '@/app/context/AuthContext'
import regionApi from '@/api/regionApi';
import CustomDropdown from '@/components/CustomDropdown'
import { checkEmptyForm } from '@/utils/commonFunctions'
import authenticationApi from '@/api/authenticationApi';
import { showToast } from '@/utils/toastUtils'
import BackButton from '@/components/BackButton'

type ErrorState = {
    userName: string | null;
    userPhoneNumber: string | null;
    regionId: number | null;
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
};

const SignUpCustomer = () => {

    const { signUp } = useAuth();

    const emptyForm = {
        roleId: 1,
        userName: '',
        userPhoneNumber: '',
        regionId: 0,
        email: '',
        password: '',
        userImage: '',
    }
    const [form, setForm] = useState(emptyForm)

    const emptyError: ErrorState = {
        userName: null,
        userPhoneNumber: null,
        regionId: null,
        email: null,
        password: null,
        confirmPassword: null,
    }
    const [error, setError] = useState<ErrorState>(emptyError);

    const [region, setRegion] = useState([]);
    const [confirmPassword, setConfirmPassword] = useState('')

    const [isSubmitting, setisSubmitting] = useState(false);

    const handleGetRegionAPI = async () => {
        try {
            const response = await regionApi().getRegion();
            if (response.status === 200) {
                setRegion(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    console.log("form", form)

    const handleSignUpAPI = async () => {
        try {
            setisSubmitting(true);

            const errors = checkEmptyForm(form, confirmPassword);
            if (Object.values(errors).some(error => error !== null)) {
                setError(errors as ErrorState);
                return;
            }
            if (form.password !== confirmPassword) {
                setError((prevError) => ({
                    ...prevError,
                    confirmPassword: 'Password tidak cocok',
                }));
                return;
            }

            const res = await authenticationApi().isEmailRegistered({
                email: form.email,
            })

            if (res.error) {
                showToast('error', res.error);
                return
            } else {
                signUp(form);
            }
        } catch {
            console.log(error);
        } finally {
            setisSubmitting(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.canceled) {
            setForm({ ...form, userImage: result.assets[0].uri })
        }
    };

    const headerContent = (
        <View className="flex-row">
            <BackButton />
            <View className="flex-1 items-center pr-3">
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

    useEffect(() => {
        handleGetRegionAPI();
    }, []);

    return (
        <AuthLayout headerContent={headerContent} footerContent={footerContent}>
            <View className="mt-4 w-full items-center">
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
                // placeholder='Masukkan Nama Anda'
                onChangeText={(text) => {
                    setForm({ ...form, userName: text });
                    setError((prevError) => ({ ...prevError, userName: null }));
                }}
                keyboardType='default'
                moreStyles='mt-7'
                error={error.userName}
            />
            <FormField
                label='Nomor Telepon'
                value={form.userPhoneNumber}
                // placeholder='Masukkan Nomor Telepon Anda'
                onChangeText={(text) => {
                    setForm({ ...form, userPhoneNumber: text });
                    setError((prevError) => ({ ...prevError, userPhoneNumber: null }));
                }}
                keyboardType='phone-pad'
                moreStyles='mt-7'
                error={error.userPhoneNumber}
            />
            <CustomDropdown
                label='Lokasi'
                data={region}
                value={form.regionId}
                placeholder='Pilih lokasi Anda'
                labelField='regionName'
                valueField='regionId'
                onChange={(text) => {
                    setForm({ ...form, regionId: Number(text) });
                    setError((prevError) => ({ ...prevError, regionId: null }));
                }}
                moreStyles='mt-7'
                error={error.regionId}
            />
            <FormField
                label='Email'
                value={form.email}
                // placeholder='Masukkan Email Anda'
                onChangeText={(text) => {
                    setForm({ ...form, email: text });
                    setError((prevError) => ({ ...prevError, email: null }));
                }}
                keyboardType='email-address'
                moreStyles='mt-7'
                error={error.email}
            />
            <FormField
                label='Password'
                // placeholder='Masukkan Password Anda'
                value={form.password}
                onChangeText={(text) => {
                    setForm({ ...form, password: text });
                    setError((prevError) => ({ ...prevError, password: null }));
                }}
                keyboardType='default'
                moreStyles='mt-7'
                error={error.password}
            />
            <FormField
                label='Konfirmasi Password'
                // placeholder='Konfirmasi Password Anda'
                value={confirmPassword}
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    setError((prevError) => ({ ...prevError, confirmPassword: null }));
                }}
                keyboardType='default'
                moreStyles='mt-7'
                error={error.confirmPassword}
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

export default SignUpCustomer