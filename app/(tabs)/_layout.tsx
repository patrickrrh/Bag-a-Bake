import { View, Text } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'

const TabsLayout = () => {

  return (
    <>
      <Stack>
        <Stack.Screen 
          name='home'
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  )
}

export default TabsLayout