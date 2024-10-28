import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const OrderCustomerLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name="orderDetail" />
        <Stack.Screen name="orderPage" />
    </Stack>
  )
}

export default OrderCustomerLayout