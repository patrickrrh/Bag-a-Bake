import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomLogo from '@/components/CustomLogo'
import TextHeader from '@/components/texts/TextHeader'
import TextHeadline from '@/components/texts/TextHeadline'
import FormField from '@/components/FormField'

const Login = () => {

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  return (
    <SafeAreaView className="bg-background h-full">
      <ScrollView>
        <View className='w-full h-full justify-center px-8'>
          <CustomLogo imageWidth={60} imageHeight={60} fontSize={16} />
          <View className='mt-12'>
            <TextHeader label="Selamat Datang" />
            <View className='mt-2'>
              <TextHeadline label="Masuk akun Bag a Bake Anda" />
              <View className='mt-12'>
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
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Login