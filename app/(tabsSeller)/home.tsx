import { View, Text, Image, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import UploadButton from '@/components/UploadButton';
import { Picker } from '@react-native-picker/picker';
import TabsSellerLayout from './_layout';
import { images } from '@/constants/images';
import TextTitle4 from '@/components/texts/TextTitle4';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import TextTitle5Gray from '@/components/texts/TextTitle5Gray';
import { useAuth } from '../context/AuthContext';
import TextTitle3 from '@/components/texts/TextTitle3';
import TextLink from '@/components/texts/TextLink';
import SellerOrderCard from '@/components/SellerOrderCard';
import SellerOrderCardPending from '@/components/SellerOrderCardPending';
import orderSellerApi from '@/api/orderSellerApi';

const Home = () => {

  const { userData, signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [latestPendingOrder, setLatestPendingOrder] = useState(null);
  const [latestOngoingOrder, setLatestOngoingOrder] = useState(null);
  const [latestPendingOrderCount, setLatestPendingOrderCount] = useState(null);
  const [latestOngoingOrderCount, setLatestOngoingOrderCount] = useState(null);

  const handleSignOut = async () => {
    signOut();
  }

  const handleGetLatestPendingOrderApi = async () => {
    try {
      const response = await orderSellerApi().getLatestPendingOrder();
      if (response.status === 200) {
        setLatestPendingOrder(response.data || null);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetLatestOngoingOrderApi = async () => {
    try {
      const response = await orderSellerApi().getLatestOngoingOrder();
      if (response.status === 200) {
        setLatestOngoingOrder(response.data || null);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCountAllPendingOrderApi = async () => {
    try {
      const response = await orderSellerApi().countAllPendingOrder();
      if (response.status === 200) {
        setLatestPendingOrderCount(response.data || null);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCountAllOngoingOrderApi = async () => {
    try {
      const response = await orderSellerApi().countAllOngoingOrder();
      if (response.status === 200) {
        setLatestOngoingOrderCount(response.data || null);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetLatestPendingOrderApi();
    handleGetLatestOngoingOrderApi();
    handleCountAllPendingOrderApi();
    handleCountAllOngoingOrderApi();
  }, [])

  return (
    <SafeAreaView className="flex-1 p-5 bg-background h-full">
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className='flex-row justify-between items-center w-full'>
          <View className='flex-row items-center gap-x-3'>
            <View className="w-10 h-10 border border-gray-200 rounded-full">
              <Image
                source={images.profile}
                className="w-full h-full rounded-full"
              />
            </View>
            <View className='flex-col'>
              <TextTitle4 label="Halo" />
              <TextTitle5Gray label={userData?.userName || ''} />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => { }}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              borderRadius: 25,
              padding: 8,
            }}
            className='w-10 h-10 justify-center items-center'
          >
            <FontAwesome name="bell" size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <View className='mt-8'>
          <View className='flex-row justify-between items-center w-full'>
            <TextTitle3 label="Pesanan Terbaru" />
            {
              latestPendingOrderCount ? (
                <TextLink label={`${latestPendingOrderCount} pesanan baru >`} size={10} />
              ) : (null)
            }
          </View>

          <SellerOrderCardPending
            order={latestPendingOrder}
            onPress={() => { }}
          />
        </View>

        <View className='mt-8'>
          <View className='flex-row justify-between items-center w-full'>
            <TextTitle3 label="Pesanan Berlangsung" />
            {
              latestOngoingOrderCount ? (
                <TextLink label={`${latestOngoingOrderCount} pesanan berlangsung >`} size={10} />
              ) : (null)
            }
          </View>

          <SellerOrderCard
            order={latestOngoingOrder}
            onPress={() => { }}
          />
        </View>

        <CustomButton
          label='logout sementara'
          handlePress={handleSignOut}
          buttonStyles='mt-4'
          isLoading={isSubmitting}
        />


      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
