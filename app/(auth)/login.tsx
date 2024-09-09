import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomLogo from '@/components/CustomLogo';
import TextHeader from '@/components/texts/TextHeader';
import TextHeadline from '@/components/texts/TextHeadline';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import TextLink from '@/components/texts/TextLink';
import { Link, router } from 'expo-router';
import axios from 'axios';
import loginApi from '@/api/loginApi';
import ErrorMessage from '@/components/texts/ErrorMessage';

const Login = () => {

  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null)

  const [isSubmitting, setisSubmitting] = useState(false);

  const handleLoginAPI = async () => {
    setisSubmitting(true);

    try {
      console.log("form data", form)
      const response = await loginApi().login(form)
      if (response.error) {
        setError(response.error)
      } else {
        setForm({ email: '', password: '' })
        setError(null)
        // router.push('/home')
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-background h-full flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-8">
          <CustomLogo imageWidth={60} imageHeight={60} fontSize={16} />
          <View className="mt-12">
            <TextHeader label="Selamat Datang" />
            <View className="mt-2">
              <TextHeadline label="Masuk akun Bag a Bake Anda" />
              <View className="mt-12">
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
                  <Link href="/(auth)/sign-up">
                    <TextLink label='Lupa Password?' />
                  </Link>
                </View>

                <CustomButton
                  label='MASUK'
                  handlePress={handleLoginAPI}
                  buttonStyles='mt-8'
                  isLoading={isSubmitting}
                />

                {
                  error && (
                    <View className="mt-4 flex-row justify-center">
                      <ErrorMessage label={error} />
                    </View>
                  )
                }
              </View>
            </View>
          </View>

          <View style={{ flex: 1 }} />
          <View className="flex-row justify-center space-x-2 mb-8">
            <TextHeadline label='Belum memiliki akun?' />
            <Link href="/(auth)/sign-up">
              <TextLink label='Daftar disini' />
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
