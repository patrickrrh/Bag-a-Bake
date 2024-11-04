import { View, Text } from 'react-native'
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

    return (
        <View className='bg-background px-5 flex-1'>

            <View style={{ height: insets.top }} />

            <View className='flex-row items-center justify-between w-'>
                <BackButton />
                <View className='items-center flex-1'>
                    <TextTitle3 label="Lupa Kata Sandi" />
                </View>
            </View>
            <View className='justify-center flex-1'>
                <View className='w-full items-center'>
                    <Text style={{ fontFamily: "poppinsSemiBold", fontSize: 12, textAlign: 'center', width: "70%" }}>Silakan masukkan email Anda untuk menerima kode verifikasi</Text>
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
                />
                <CustomButton
                    label='Kirim OTP'
                    handlePress={() => { }}
                    buttonStyles='mt-8'
                    isLoading={isSubmitting}
                />
            </View>
        </View>
    )
}

export default ForgotPassword