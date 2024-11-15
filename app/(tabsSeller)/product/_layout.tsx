import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ProductLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name="createProduct" />
        <Stack.Screen name='editProduct' />
    </Stack>
  )
}

export default ProductLayout