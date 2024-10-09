import { View, Text, ScrollView } from 'react-native';
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

type ErrorState = {
  email: string | null;
  password: string | null;
};

const SignIn = () => {

  const { signIn, signOut } = useAuth();

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

  const handleSignInAPI = () => {
    try {
      setisSubmitting(true);
  
      const errors = checkEmptyForm(form);
      if (Object.values(errors).some(error => error !== null)) {
        setError(errors as ErrorState);
        return;
      }
  
      signIn(form);
    } catch (error) {
      console.log(error);
    } finally {
      setisSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    signOut();
  }

  const handleCustomerPage = () => {
    router.push('/(tabsCustomer)/home');
  }

  const headerContent = (
    <>
      <CustomLogo imageWidth={60} imageHeight={60} fontSize={16} />
      <View className="mt-16 items-center">
        <TextHeader label="Selamat Datang" />
        {/* <View className='mt-2'>
          <TextHeadline label="Masuk akun Bag a Bake Anda" />
        </View> */}
      </View>
    </>
  )

  const footerContent = (
    <>
      <TextHeadline label="Belum memiliki akun?" />
      <Link href="/(auth)/signUp">
        <TextLink label="Daftar disini" />
      </Link>
    </>
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setisSplashVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (

    <AuthLayout headerContent={headerContent} footerContent={footerContent}>
      <Toast />
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
      <FormField
        label='Password'
        value={form.password}
        onChangeText={(text) => {
          setForm({ ...form, password: text });
          setError((prevError) => ({ ...prevError, password: null }));
        }}
        moreStyles='mt-7'
        error={error.password}
      />

      <View className="mt-6 flex-row justify-end">
        <Link href="/(auth)/signUp">
          <TextLink label='Lupa Password?' />
        </Link>
      </View>

      <CustomButton
        label='MASUK'
        handlePress={handleSignInAPI}
        buttonStyles='mt-8'
        isLoading={isSubmitting}
      />

      <CustomButton
        label='logout sementara'
        handlePress={handleSignOut}
        buttonStyles='mt-4'
        isLoading={isSubmitting}
      />

      <CustomButton 
        label='customerpage' 
        handlePress={handleCustomerPage} 
        buttonStyles='mt-4' 
        isLoading={isSubmitting}
      />

      <CustomButton 
        label='customerpage' 
        handlePress={handleCustomerPage} 
        buttonStyles='mt-4' 
        isLoading={isSubmitting}
      />

      <CustomButton
        label='Tambahkan Produk'
        handlePress={() => router.push('/(tabsSeller)/createProduct')} 
        buttonStyles='mt-4'
        isLoading={false} 
      />
    </AuthLayout>

  );
};

export default SignIn;
