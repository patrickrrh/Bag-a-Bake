import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '@/components/CustomButton'
import { useAuth } from '@/app/context/AuthContext'
import SplashScreen from '@/components/SplashScreen'

const Home = () => {

  const { justSignedIn } = useAuth();
  const [isSubmitting, setisSubmitting] = useState(false);
  const [isSplashVisible, setSplashVisible] = useState(false);

  const { signOut } = useAuth();

  const handleLogout = async () => {
    signOut();
  }

  console.log("login status di home:", justSignedIn)

  useEffect(() => {
    if (!justSignedIn) {
      setSplashVisible(true);
      const timer = setTimeout(() => {
        setSplashVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [justSignedIn]);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <View>
      <Text>Home</Text>
      <CustomButton
        label='logout sementara'
        handlePress={handleLogout}
        buttonStyles='mt-4'
        isLoading={isSubmitting}
      />

    </View>
  )
}

export default Home