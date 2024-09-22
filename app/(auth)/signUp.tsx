import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomLogo from '@/components/CustomLogo';
import TextHeader from '@/components/texts/TextHeader';
import TextHeadline from '@/components/texts/TextHeadline';
import FormField from '@/components/FormField';
import { Link, router } from 'expo-router';
import TextLink from '@/components/texts/TextLink';
import CustomButton from '@/components/CustomButton';
import ErrorMessage from '@/components/texts/ErrorMessage';
import RoleCard from '@/components/RoleCard';
import AuthLayout from './authLayout';

const SignUp = () => {

  const [selectedRole, setSelectedRole] = useState(0)
  const [form, setForm] = useState({
    username: '',
    telepon: '',
    email: '',
    password: ''
  })

  const [error, setError] = useState(null)

  const [isSubmitting, setisSubmitting] = useState(false);

  const headerContent = (
    <>
      <CustomLogo imageWidth={60} imageHeight={60} fontSize={16} />
      <View className="mt-16">
        <TextHeader label="Pilih Peran Anda" />
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
      <View className="flex-row space-x-2 justify-between w-full mt-8">
        <RoleCard
          label="Pembeli"
          isSelected={selectedRole === 1}
          onPress={() => setSelectedRole(1)}
        />
        <RoleCard
          label="Pemilik Bakeri"
          isSelected={selectedRole === 2}
          onPress={() => setSelectedRole(2)}
        />
      </View>

      <CustomButton
        label='LANJUT'
        handlePress={() => {
          if (selectedRole === 1) {
            router.push('/(auth)/signUpPembeli')
          } else {
            router.push('/(auth)/signUpPemilikBakeri')
          }
        }}
        buttonStyles='mt-8 w-full'
        isLoading={isSubmitting}
      />

      {
        error && (
          <View className="mt-4 flex-row justify-center w-full">
            <ErrorMessage label={error} />
          </View>
        )
      }
    </AuthLayout >
  );
}

export default SignUp