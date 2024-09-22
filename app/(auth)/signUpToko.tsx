import { View, Text, ScrollView, Image, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomLogo from '@/components/CustomLogo'
import TextHeader from '@/components/texts/TextHeader'
import CustomButton from '@/components/CustomButton'
import ErrorMessage from '@/components/texts/ErrorMessage'
import TextHeadline from '@/components/texts/TextHeadline'
import { Link, router, useLocalSearchParams, useRouter } from 'expo-router'
import TextLink from '@/components/texts/TextLink'
import FormField from '@/components/FormField'
import * as ImagePicker from 'expo-image-picker';
import UploadButton from '@/components/UploadButton'
import { images } from '@/constants/images'
import AuthLayout from './authLayout'
import { useAuth } from '@/app/context/AuthContext'

const SignUpToko = () => {

    const { signUp } = useAuth();

    const router = useRouter();
    const { username, email, password, profilePicture } = useLocalSearchParams();

    const [form, setForm] = useState({
        namaToko: '',
        jamBuka: '',
        jamTutup: '',
        alamatToko: '',
        noTeleponToko: '',
        deskripsiToko: '',
        gambarToko: '',
    })
    const [confirmPassword, setConfirmPassword] = useState('')

    const [error, setError] = useState<string | null>(null)

    const [isSubmitting, setisSubmitting] = useState(false);

    const handleSignUpAPI = () => {
        signUp(form);
      };   

    useEffect(() => {
        setForm((prevForm) => ({
            ...prevForm,
            username: username,
            email: email,
            password: password,
            profilePicture: profilePicture,
        }));
    }, [username, email, password, profilePicture]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.canceled) {
            setForm({ ...form, gambarToko: result.assets[0].uri })
        }
    };

    const headerContent = (
        <>
            <TextHeader label="2/2 - Daftar Akun" />
            <View className='mt-2'>
                <TextHeadline label="Selamat datang! Silakan lengkapi data toko Anda." />
            </View>
        </>
    )

    const footerContent = (
        <>
            <TextHeadline label='Sudah memiliki akun?' />
            <Link href="/(auth)/login">
                <TextLink label='Masuk disini' />
            </Link>
        </>
    );

    return (
        <AuthLayout headerContent={headerContent} footerContent={footerContent}>
            <FormField
                label='Nama Toko'
                value={form.namaToko}
                onChangeText={(text) => setForm({ ...form, namaToko: text })}
                keyboardType='default'
                moreStyles='mt-7'
            />
            <View className="flex-row space-x-4">
                <View className="flex-1">
                    <FormField
                        label="Jam Buka"
                        value={form.jamBuka}
                        onChangeText={(text) => setForm({ ...form, jamBuka: text })}
                        keyboardType="default"
                        moreStyles="mt-7"
                    />
                </View>
                <View className="flex-1">
                    <FormField
                        label="Jam Tutup"
                        value={form.jamTutup}
                        onChangeText={(text) => setForm({ ...form, jamTutup: text })}
                        keyboardType="default"
                        moreStyles="mt-7"
                    />
                </View>
            </View>
            <FormField
                label='Alamat Toko'
                value={form.alamatToko}
                onChangeText={(text) => setForm({ ...form, alamatToko: text })}
                keyboardType='default'
                moreStyles='mt-7'
            />
            <FormField
                label='Nomor Telepon'
                value={form.noTeleponToko}
                onChangeText={(text) => setForm({ ...form, noTeleponToko: text })}
                keyboardType='phone-pad'
                moreStyles='mt-7'
            />
            <FormField
                label='Deskripsi Toko'
                value={form.deskripsiToko}
                onChangeText={(text) => setForm({ ...form, deskripsiToko: text })}
                keyboardType='default'
                moreStyles='mt-7'
            />

            <View className="mt-8 w-full flex-row space-x-4">
                <UploadButton label="Unggah Foto" handlePress={pickImage} />
                {form.gambarToko && (
                    <View className="w-24 h-20 border border-gray-200">
                        <Image
                            source={{ uri: form.gambarToko }}
                            className="w-full h-full rounded-md"
                        />
                    </View>
                )}
            </View>

            <CustomButton
                label='Daftar'
                handlePress={() => (1)}
                buttonStyles='mt-10 w-full'
                isLoading={isSubmitting}
            />

            {error && (
                <View className="mt-4 flex-row justify-center w-full">
                    <ErrorMessage label={error} />
                </View>
            )}
        </AuthLayout>
    )
}

export default SignUpToko