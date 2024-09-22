import { View, Text, ScrollView, Image, Button } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomLogo from '@/components/CustomLogo'
import TextHeader from '@/components/texts/TextHeader'
import CustomButton from '@/components/CustomButton'
import ErrorMessage from '@/components/texts/ErrorMessage'
import TextHeadline from '@/components/texts/TextHeadline'
import { Link } from 'expo-router'
import TextLink from '@/components/texts/TextLink'
import FormField from '@/components/FormField'
import * as ImagePicker from 'expo-image-picker';
import UploadButton from '@/components/UploadButton'
import { images } from '@/constants/images'
import AuthLayout from './authLayout'
import { useAuth } from '@/app/context/AuthContext'

const SignUpPembeli = () => {

    const { signUp } = useAuth();

    const [form, setForm] = useState({
        idPeran: 1,
        username: '',
        telepon: '',
        alamat: '',
        email: '',
        password: '',
        profilePicture: '',
    })
    const [confirmPassword, setConfirmPassword] = useState('')

    const [error, setError] = useState<string | null>(null)

    const [isSubmitting, setisSubmitting] = useState(false);

    const handleSignUpAPI = () => {
        if (!validatePassword()) {
            return;
        }
        signUp(form);
      };    

    const validatePassword = () => {
        if (form.password !== confirmPassword) {
            setError('Password tidak cocok')
            return false;
        } else {
            setError(null)
            return true
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.canceled) {
            setForm({ ...form, profilePicture: result.assets[0].uri })
        }
    };

    const headerContent = (
        <>
            <TextHeader label="Daftar Akun" />
            <View className='mt-2'>
                <TextHeadline label="Selamat datang! Silakan lengkapi data Anda." />
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
            <View className="mt-4 w-full items-center">
                {form.profilePicture ? (
                    <View className="w-24 h-24 border border-gray-200 rounded-full mb-4">
                        <Image
                            source={{ uri: form.profilePicture }}
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
                value={form.username}
                onChangeText={(text) => setForm({ ...form, username: text })}
                keyboardType='default'
                moreStyles='mt-7'
            />
            <FormField
                label='Nomor Telepon'
                value={form.telepon}
                onChangeText={(text) => setForm({ ...form, telepon: text })}
                keyboardType='phone-pad'
                moreStyles='mt-7'
            />
            <FormField
                label='Alamat'
                value={form.alamat}
                onChangeText={(text) => setForm({ ...form, alamat: text })}
                keyboardType='default'
                moreStyles='mt-7'
            />
            <FormField
                label='Email'
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
                keyboardType='email-address'
                moreStyles='mt-7'
            />
            <FormField
                label='Password'
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
                keyboardType='default'
                moreStyles='mt-7'
            />
            <FormField
                label='Konfirmasi Password'
                value={form.password}
                onChangeText={(text) => setConfirmPassword(text)}
                keyboardType='default'
                moreStyles='mt-7'
            />

            <CustomButton
                label='Daftar'
                handlePress={() => handleSignUpAPI()}
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

export default SignUpPembeli