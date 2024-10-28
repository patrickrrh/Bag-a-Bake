import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const BakeryLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name="bakeryDetail" />
    </Stack>
  )
}

export default BakeryLayout