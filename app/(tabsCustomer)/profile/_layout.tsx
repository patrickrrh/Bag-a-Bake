import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ProfileCustomerLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='profilePage' />
        <Stack.Screen name="changePassword" />
    </Stack>
  )
}

export default ProfileCustomerLayout