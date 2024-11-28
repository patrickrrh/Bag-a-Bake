import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Toast from 'react-native-toast-message'

const ProfileCustomerLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name="changePassword" />
    </Stack>
  )
}

export default ProfileCustomerLayout