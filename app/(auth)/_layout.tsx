import { View, Text } from 'react-native'
import React from 'react'
import { router, Slot, Stack } from 'expo-router'

const AuthLayout = () => {

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='signIn'/>
        <Stack.Screen name='signUp'/>
        <Stack.Screen name='signUpCustomer'/>
        <Stack.Screen name='signUpBakeryOwner'/>
        <Stack.Screen name='signUpBakery'/>
        <Stack.Screen name='signUpPaymentInfo'/>
        <Stack.Screen name='forgotPassword'/>
        <Stack.Screen name='inputOTP'/>
        <Stack.Screen name='changePassword'/>
      </Stack>
    </>
  )
}

export default AuthLayout