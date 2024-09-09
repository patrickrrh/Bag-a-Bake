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

const SignUp = () => {

  const [selectedRole, setSelectedRole] = useState("")
  const [form, setForm] = useState({
    username: '',
    telepon: '',
    email: '',
    password: ''
  })

  const [error, setError] = useState(null)

  const [isSubmitting, setisSubmitting] = useState(false);

  return (
    <SafeAreaView className="bg-background h-full flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1, width: '100%' }}>
        <View className="flex-1 justify-center px-8 w-full">
          <CustomLogo imageWidth={60} imageHeight={60} fontSize={16} />
          <View className="mt-12 items-center w-full">
            <TextHeader label="Pilih Peran Anda" />

            <View className="mt-12 w-full">
              <View className="flex-row space-x-2 justify-between w-full">
                <RoleCard
                  label="Pemilik Bakeri"
                  isSelected={selectedRole === 'Pemilik Bakeri'}
                  onPress={() => setSelectedRole('Pemilik Bakeri')}
                />
                <RoleCard
                  label="Pembeli"
                  isSelected={selectedRole === 'Pembeli'}
                  onPress={() => setSelectedRole('Pembeli')}
                />
              </View>

              <CustomButton
                label='LANJUT'
                handlePress={() => router.push("/(auth)/sign-up")}
                buttonStyles='mt-8 w-full'
                isLoading={isSubmitting}
              />

              {error && (
                <View className="mt-4 flex-row justify-center w-full">
                  <ErrorMessage label={error} />
                </View>
              )}
            </View>
          </View>

          <View style={{ flex: 1 }} />
          <View className="flex-row justify-center space-x-2 mb-8 w-full">
            <TextHeadline label='Sudah memiliki akun?' />
            <Link href="/(auth)/login">
              <TextLink label='Masuk disini' />
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>

  );
}

export default SignUp