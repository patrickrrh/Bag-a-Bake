import { View, Text } from 'react-native'
import React from 'react'
import { router, Slot, Stack } from 'expo-router'

const AuthLayout = () => {

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='login'/>
        <Stack.Screen name='signUp'/>
        <Stack.Screen name='signUpPembeli'/>
        <Stack.Screen name='signUpPemilikBakeri'/>
        <Stack.Screen name='signUpToko'/>
      </Stack>
    </>
  )
}

export default AuthLayout