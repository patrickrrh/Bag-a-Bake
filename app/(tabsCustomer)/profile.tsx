import { View, Text } from 'react-native'
import React, { useState } from 'react'
import CustomButton from '@/components/CustomButton'
import { useAuth } from '../context/AuthContext'

const Profile = () => {

  const { signOut } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <View className='h-screen justify-center'>
      <CustomButton
        label='logout sementara'
        handlePress={() => signOut()}
        buttonStyles='mt-4'
        isLoading={isSubmitting}
      />
    </View>
  )
}

export default Profile