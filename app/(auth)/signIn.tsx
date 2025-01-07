import { View, Text, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomLogo from '@/components/CustomLogo';
import TextHeader from '@/components/texts/TextHeader';
import TextHeadline from '@/components/texts/TextHeadline';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import TextLink from '@/components/texts/TextLink';
import { Link, router } from 'expo-router';
import axios from 'axios';
import authenticationApi from '@/api/authenticationApi';
import ErrorMessage from '@/components/texts/ErrorMessage';
import AuthLayout from './authLayout';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/app/context/AuthContext';
import SplashScreen from '@/components/SplashScreen';
import { checkEmptyForm } from '@/utils/commonFunctions';
import Toast from 'react-native-toast-message';
import { showToast } from '@/utils/toastUtils';
import { requestNotificationPermission } from '@/utils/notificationUtils';

type ErrorState = {
  email: string | null;
  password: string | null;
};

const SignIn = () => {

  const { signIn, justSignedIn, signOut } = useAuth();

  const emptyForm = {
    email: '',
    password: ''
  }
  const [form, setForm] = useState(emptyForm)

  const emptyError: ErrorState = {
    email: null,
    password: null,
  };
  const [error, setError] = useState<ErrorState>(emptyError);

  const [isSubmitting, setisSubmitting] = useState(false);
  const [isSplashVisible, setisSplashVisible] = useState(true);
  const handleSignInAPI = async () => {
    try {
      setisSubmitting(true);

      const errors = checkEmptyForm(form);
      if (Object.values(errors).some(error => error !== null)) {
        setError(errors as ErrorState);
        return;
      }

      const res = await authenticationApi().checkAccount({
        email: form.email,
        password: form.password
      })

      if (res.error) {
        showToast('error', res.error);
        return;
      } else {
        const token = await requestNotificationPermission();
        if (token) {
          signIn({
            userId: res.data.userId,
            pushToken: token.data,
          });
        }
      }

    } catch (error) {
      console.log(error);
      return;
    } finally {
      setisSubmitting(false);
    }
  };

  const headerContent = (
    <>
      <CustomLogo imageWidth={60} imageHeight={60} fontSize={16} />
      <View className="mt-16 items-center">
        <TextHeader label="Selamat Datang" />
      </View>
    </>
  )

  const footerContent = (
    <>
      <View className='mr-1'>
        <TextHeadline label="Belum memiliki akun?" />
      </View>
      <TextLink label='Daftar disini' size={14} onPress={() => router.push('/(auth)/signUp')} />
    </>
  );

  useEffect(() => {
    if (!justSignedIn) {
      setisSplashVisible(true);
      const timer = setTimeout(() => {
        setisSplashVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setisSplashVisible(false);
    }
  }, [justSignedIn]);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <AuthLayout headerContent={headerContent} footerContent={footerContent}>
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
        moreStyles='mt-7'
        error={error.password}
        placeholder='Masukkan kata sandi'
      />

      <View className="mt-6 flex-row justify-end">
        <TextLink label='Lupa kata sandi?' size={14} onPress={() => router.push('/(auth)/forgotPassword')} />
      </View>

      <CustomButton
        label='MASUK'
        handlePress={() => handleSignInAPI()}
        buttonStyles='mt-8'
        isLoading={isSubmitting}
      />
    </AuthLayout>
  );
};

export default SignIn;
