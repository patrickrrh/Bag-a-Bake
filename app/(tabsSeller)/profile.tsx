import { View, Text, Image, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import UploadButton from '@/components/UploadButton';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';

const Profile = () => {

  const { userData, signOut } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignOut = async () => {
    signOut();
  }

  return (
    <View>
      <Text>Profile</Text>
      <CustomButton
        label='logout sementara'
        handlePress={handleSignOut}
        buttonStyles='mt-4'
        isLoading={isSubmitting}
      />
    </View>

  );
};

export default Profile;

