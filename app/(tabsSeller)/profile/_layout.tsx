import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ProfileSellerLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name="changePassword" />
    </Stack>
  )
}


export default ProfileSellerLayout