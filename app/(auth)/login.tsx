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


const Login = () => {

  const { login, logout } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null)

  const [isSubmitting, setisSubmitting] = useState(false);
  const [isSplashVisible, setSplashVisible] = useState(true);

  const handleLoginAPI = () => {
    login(form.email, form.password);
  };

  const handleLogout = async () => {
    logout();
  }

  const headerContent = (
    <>
      <CustomLogo imageWidth={60} imageHeight={60} fontSize={16} />
      <View className="mt-16">
        <TextHeader label="Selamat Datang" />
        <View className='mt-2'>
          <TextHeadline label="Masuk akun Bag a Bake Anda" />
        </View>
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
      setSplashVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (

    <AuthLayout headerContent={headerContent} footerContent={footerContent}>
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
        moreStyles='mt-7'
      />

      <View className="mt-6 flex-row justify-end">
        <Link href="/(auth)/signUp">
          <TextLink label='Lupa Password?' />
        </Link>
      </View>

      <CustomButton
        label='MASUK'
        handlePress={handleLoginAPI}
        buttonStyles='mt-8'
        isLoading={isSubmitting}
      />

      <CustomButton
        label='logout sementara'
        handlePress={handleLogout}
        buttonStyles='mt-4'
        isLoading={isSubmitting}
      />

      <CustomButton
        label='Tambahkan Produk'
        handlePress={() => router.push('/(tabsSeller)/createProduct')} 
        buttonStyles='mt-4'
        isLoading={false} 
      />

      {
        error && (
          <View className="mt-4 flex-row justify-center">
            <ErrorMessage label={error} />
          </View>
        )
      }
    </AuthLayout>

  );
};

export default Login;
