import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ProductLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='listProduct' />
        <Stack.Screen name="productDetail" />
    </Stack>
  )
}

export default ProductLayout