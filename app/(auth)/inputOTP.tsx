import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import AuthLayout from './authLayout'
import CustomLogo from '@/components/CustomLogo'
import TextHeader from '@/components/texts/TextHeader'
import TextHeadline from '@/components/texts/TextHeadline'
import TextLink from '@/components/texts/TextLink'
import { router, useLocalSearchParams } from 'expo-router'
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
import { OtpInput } from 'react-native-otp-entry'
import ProgressBar from '@/components/ProgressBar'
import { Ionicons } from '@expo/vector-icons'
import TextTitle5 from '@/components/texts/TextTitle5'
import { set } from 'date-fns'

type ErrorState = {
    otp: string | null;
};

const InputOTP = () => {

    const insets = useSafeAreaInsets();

    const { email } = useLocalSearchParams();

    const emptyForm = {
        otp: '',
    }
    const [form, setForm] = useState(emptyForm)

    const emptyError: ErrorState = {
        otp: null,
    }
    const [error, setError] = useState<ErrorState>(emptyError)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isOtpFilled, setIsOtpFilled] = useState(false)
    const [isCountingDown, setIsCountingDown] = useState(true);
    const [countdown, setCountdown] = useState(60);

    const handleVerifyOTPApi = async () => {
        try {
            setIsSubmitting(true)

            if (!isOtpFilled) {
                setError((prevError) => ({ ...prevError, otp: 'Kode OTP tidak valid' }))
                return;
            }

            const res = await authenticationApi().verifyOTP({
                email: email,
                inputOTP: form.otp
            })

            if (res.status === 200) {
                router.push({
                    pathname: '/(auth)/changePassword' as any,
                    params: { email: email }
                })
            } else {
                showToast('error', res.error)
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        let timer: any;
        if (isCountingDown && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsCountingDown(false);
        }
        return () => clearInterval(timer);
    }, [isCountingDown, countdown]);

    const handleResendOTP = async () => {
        try {
            const res = await authenticationApi().sendOTP({ 
                email: email
            })

            if (res.status === 200) {
                showToast('success', 'Kode OTP berhasil dikirimkan, silakan cek email Anda')
                setIsCountingDown(true)
                setCountdown(60);
            } else {
                showToast('error', res.error)
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className='bg-background px-5 flex-1'>

                <View style={{ height: insets.top }} />

                <View className="flex-row items-center justify-between w-full space-x-4">
                    <BackButton />
                    <View className="flex-1 mx-2">
                        <ProgressBar progress={0.4} />
                    </View>
                </View>

                <View className='justify-center flex-1 mb-16'>
                    <View className='items-center mb-7'>
                        <View className='w-full items-center'>
                            <View className='w-[45] h-[45] justify-center items-center mb-5 border border-gray-200 rounded-lg'>
                                <Ionicons name='mail-open-outline' size={30} color='black' />
                            </View>
                        </View>
                        <TextHeader label="Verifikasi Email" />
                        <TextTitle5 label={`Silakan masukkan kode OTP yang dikirimkan ke email ${email}`} color='#828282'
                            containerStyle={{ width: '60%', alignItems: 'center', marginTop: 12 }} textStyle={{ textAlign: 'center' }} />
                    </View>
                    <OtpInput
                        numberOfDigits={6}
                        focusColor={'#B0795A'}
                        onTextChange={(text) => {
                            setForm({ ...form, otp: text });
                            setIsOtpFilled(false);
                            setError((prevError) => ({ ...prevError, otp: null }));
                        }}
                        onFilled={() => setIsOtpFilled(true)}
                        theme={{
                            pinCodeContainerStyle: { borderColor: error.otp ? 'red' : '#D3D3D3', },
                        }}
                    />
                    {error.otp && <Text style={{ color: 'red', marginTop: 5 }}>{error.otp}</Text>}

                    <CustomButton
                        label='Kirim'
                        handlePress={() => handleVerifyOTPApi()}
                        buttonStyles='mt-8'
                        isLoading={isSubmitting}
                    />

                    <View className='flex-row items-center justify-center mt-5'>
                        <View className='mr-1'>
                            <TextTitle5 label="Belum menerima email?" color='#828282' />
                        </View>

                        {
                            isCountingDown ? (
                                <TextTitle5 label={`Kirim ulang dalam ${countdown}`} color='#828282' />
                            ) : (
                                <TextLink label='Kirim Ulang' size={12} onPress={() => handleResendOTP()} />
                            )
                        }
                    </View>

                </View>
                
                <View className='flex-row items-center justify-center' style={{ marginBottom: insets.bottom }}>
                    <TextLink label='Daftar Akun Baru' size={14} onPress={() => router.push('/(auth)/signUp')} />
                </View>

            </View>
        </TouchableWithoutFeedback>
    )
}

export default InputOTP