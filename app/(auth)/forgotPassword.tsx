import { View, Text, Vibration } from 'react-native'
import React, { useState } from 'react'
import AuthLayout from './authLayout'
import CustomLogo from '@/components/CustomLogo'
import TextHeader from '@/components/texts/TextHeader'
import TextHeadline from '@/components/texts/TextHeadline'
import TextLink from '@/components/texts/TextLink'
import { router } from 'expo-router'
import BackButton from '@/components/BackButton'
import TextTitle3 from '@/components/texts/TextTitle3'
import TextTitle5Bold from '@/components/texts/TextTitle5Bold'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { checkEmptyForm } from '@/utils/commonFunctions'
import authenticationApi from '@/api/authenticationApi';
import { showToast } from '@/utils/toastUtils'
import Toast from 'react-native-toast-message'
import ProgressBar from '@/components/ProgressBar'
import { Ionicons } from '@expo/vector-icons'
import TextTitle5 from '@/components/texts/TextTitle5'

type ErrorState = {
    email: string | null;
};

const ForgotPassword = () => {

    const insets = useSafeAreaInsets();

    const emptyForm = {
        email: '',
    }
    const [form, setForm] = useState(emptyForm)

    const emptyError: ErrorState = {
        email: null,
    }
    const [error, setError] = useState<ErrorState>(emptyError)

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSendOTPApi = async () => {
        try {
            setIsSubmitting(true)

            const errors = checkEmptyForm(form);
            if (Object.values(errors).some(error => error !== null)) {
                setError(errors as ErrorState);
                return;
            }

            const res = await authenticationApi().sendOTP({
                email: form.email
            })
            if (res.status === 200) {
                router.push({
                    pathname: '/(auth)/inputOTP',
                    params: { email: form.email }
                })
            } else if (res.status === 404) {
                showToast('error', res.error)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <View className='bg-background px-5 flex-1'>
            <View style={{ height: insets.top }} />

            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
                <Toast topOffset={50} />
            </View>

            <View className="flex-row items-center justify-between w-full space-x-4">
                <BackButton />
                <View className="flex-1 mx-2">
                    <ProgressBar progress={0.1} />
                </View>
            </View>

            <View className='justify-center flex-1 mb-16'>
                <View className='items-center'>
                    <View className='w-full items-center'>
                        <View className='w-[45] h-[45] justify-center items-center mb-5 border border-gray-200 rounded-lg'>
                            <Ionicons name='finger-print-outline' size={30} color='black' />
                        </View>
                    </View>
                    <TextHeader label="Lupa Kata Sandi" />
                    <TextTitle5 label='Silakan masukkan email Anda untuk menerima kode verifikasi' color='#828282'
                        containerStyle={{ width: '70%', alignItems: 'center', marginTop: 12 }} textStyle={{ textAlign: 'center' }} />
                </View>
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
                <CustomButton
                    label='Kirim'
                    handlePress={() => handleSendOTPApi()}
                    buttonStyles='mt-8'
                    isLoading={isSubmitting}
                />
            </View>

            <View className='flex-row items-center justify-center' style={{ marginBottom: insets.bottom }}>
                <TextLink label='Daftar Akun Baru' size={14} onPress={() => router.push('/(auth)/signUp')} />
            </View>
        </View>
    )
}

export default ForgotPassword