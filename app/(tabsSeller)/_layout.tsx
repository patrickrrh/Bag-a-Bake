import { View, Text } from 'react-native'
import React from 'react'
import { router, Slot, Stack } from 'expo-router'

const TabsSellerLayout = () => {

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='createProduct'/>
      </Stack>
    </>
  )
}

export default TabsSellerLayout