import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
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

type ErrorState = {
  password: string | null;
  confirmPassword: string | null;
};

const ChangePassword = () => {

  const insets = useSafeAreaInsets();

  const { email } = useLocalSearchParams();

  const emptyForm = {
    password: '',
  }
  const [form, setForm] = useState(emptyForm)
  const [confirmPassword, setConfirmPassword] = useState('')

  const emptyError: ErrorState = {
    password: null,
    confirmPassword: null,
  }
  const [error, setError] = useState<ErrorState>(emptyError)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChangePasswordApi = async () => {
    try {
      setIsSubmitting(true)

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

      const res = await authenticationApi().changePassword({
        email: email,
        password: form.password
      })
      console.log("res", res)
      if (res.status === 200) {
        router.replace('/(auth)/signIn')
      } else {
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

      {/* <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <Toast topOffset={50} />
      </View> */}

      <View className="flex-row items-center justify-between w-full space-x-4">
        <BackButton />
        <View className="flex-1 mx-2">
          <ProgressBar progress={0.7} />
        </View>
      </View>

      <View className='justify-center flex-1 mb-16'>
        <View className='items-center'>
          <View className='w-full items-center'>
            <View className='w-[45] h-[45] justify-center items-center mb-5 border border-gray-200 rounded-lg'>
              <Ionicons name='create-outline' size={30} color='black' />
            </View>
          </View>
          <TextHeader label="Ubah Kata Sandi" />
          <TextTitle5 label='Silakan masukkan kata sandi baru Anda' color='#828282'
            containerStyle={{ width: '70%', alignItems: 'center', marginTop: 12 }} textStyle={{ textAlign: 'center' }} />
        </View>
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
          placeholder='Masukkan kata sandi baru'
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
          placeholder='Konfirmasi kata sandi baru'
        />

        <CustomButton
          label='Simpan'
          handlePress={() => { handleChangePasswordApi() }}
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

export default ChangePassword