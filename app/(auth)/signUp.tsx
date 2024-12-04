import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
import BackButton from '@/components/BackButton';

const SignUp = () => {

  const insets = useSafeAreaInsets();

  const [selectedRole, setSelectedRole] = useState(0)

  const [error, setError] = useState('')

  const [isSubmitting, setisSubmitting] = useState(false);

  const headerContent = (
    <View className="flex-row">
      <BackButton />
      <View className="flex-1 items-center pr-3">
        <CustomLogo imageWidth={60} imageHeight={60} fontSize={16} />
        <View className="mt-16">
          <TextHeader label="Pilih Peran Anda" />
        </View>
      </View>
    </View>
  );

  const footerContent = (
    <>
      <View className='mr-1'>
        <TextHeadline label='Sudah memiliki akun?' />
      </View>
      <TextLink label="Masuk disini" size={14} onPress={() => router.push('/(auth)/signIn')} />
    </>
  );

  return (
    <AuthLayout headerContent={headerContent} footerContent={footerContent}>

      <View className="flex-row space-x-2 justify-around w-full mt-8">
        <RoleCard
          label="Pembeli"
          isSelected={selectedRole === 1}
          onPress={() => {
            setSelectedRole(1);
            setError('');
          }}
        />
        <RoleCard
          label="Pemilik Bakeri"
          isSelected={selectedRole === 2}
          onPress={() => {
            setSelectedRole(2);
            setError('');
          }}
        />
      </View>

      {
        error && (
          <View className="mt-4 flex-row justify-center w-full">
            <ErrorMessage label={error} />
          </View>
        )
      }

      <CustomButton
        label='LANJUT'
        handlePress={() => {
          setisSubmitting(true)
          if (selectedRole === 0) {
            setError('Pilih peran Anda');
            setisSubmitting(false);
            return;
          } else if (selectedRole === 1) {
            router.push('/(auth)/signUpCustomer')
            setisSubmitting(false);
          } else if (selectedRole === 2) {
            router.push('/(auth)/signUpBakeryOwner')
            setisSubmitting(false);
          }
        }}
        buttonStyles='mt-8 w-full'
        isLoading={isSubmitting}
      />

    </AuthLayout >
  );
}

export default SignUp