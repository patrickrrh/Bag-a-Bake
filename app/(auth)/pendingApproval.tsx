import { View, Text, Image, Linking, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CustomLogo from '@/components/CustomLogo';
import { useAuth } from '../context/AuthContext';
import TextTitle5Gray from '@/components/texts/TextTitle5Gray';
import TextTitle3 from '@/components/texts/TextTitle3';
import ContactButton from '@/components/ContactButton';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import authenticationApi from "@/api/authenticationApi";
import CustomButton from '@/components/CustomButton';

const PendingApproval = () => {

    const insets = useSafeAreaInsets();
    const { userData, signOut } = useAuth();

    const [refreshedUserData, setRefreshedUserData] = useState(userData);
    const [isLoading, setIsLoading] = useState(false);

    console.log("user data active", refreshedUserData)

    const handleContactPress = () => {
        const email = 'example@gmail.com'
        const subject = 'Bantuan Akun Bakeri'
        const body = "Halo, saya membutuhkan bantuan terkait akun bakery saya.";

        const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        Linking.openURL(emailUrl).catch(() => {
            console.log('Tidak dapat membuka email');
        });
    }

    const handleRefreshPress = async () => {
        setIsLoading(true);
        try {
            const token = await SecureStore.getItemAsync("refreshToken");
            if (token) {
                const res = await authenticationApi().refreshUserStatus({
                    refreshToken: token
                });

                if (res.status === 200) {
                    setRefreshedUserData(res.user);
                }
            }
        } catch (error) {
            console.log(error);
        }

        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }

    useFocusEffect(
        useCallback(() => {
            handleRefreshPress();
        }, [])
    )

    return (
        <View className='bg-background px-10 flex-1'>
            <View style={{ height: insets.top, backgroundColor: '#FEFAF9' }} />

            {
                (refreshedUserData?.bakery && refreshedUserData.bakery.isActive !== 1) && (
                    <View className='flex-row justify-end'>
                        <TouchableOpacity onPress={handleRefreshPress}>
                            <Ionicons name='refresh' size={24} color='#B0795A' />
                        </TouchableOpacity>
                    </View>
                )
            }


            <View className='absolute top-0 bottom-0 left-0 right-0 justify-center'>
                <View className='items-center mx-10'>
                    {
                        isLoading ? (
                            <ActivityIndicator size="small" color="#828282" />
                        ) : (
                            <>
                                <CustomLogo imageWidth={60} imageHeight={60} fontSize={16} />
                                {
                                    refreshedUserData?.bakery === null ? (
                                        <TextTitle3 label='Akun bakeri Anda ditolak' textStyle={{ textAlign: 'center', marginTop: 20 }} />
                                    ) : refreshedUserData?.bakery.isActive === 2 ? (
                                        <TextTitle3 label='Akun bakeri Anda telah dinonaktifkan' textStyle={{ textAlign: 'center', marginTop: 20 }} />
                                    ) : refreshedUserData?.bakery.isActive === 0 ? (
                                        <TextTitle3 label='Harap menunggu, akun bakeri Anda sedang diproses' textStyle={{ textAlign: 'center', marginTop: 20 }} />
                                    ) : (
                                        <TextTitle3 label='Akun bakeri Anda telah diaktifkan' textStyle={{ textAlign: 'center', marginTop: 20 }} />
                                    )
                                }
                                {
                                    refreshedUserData?.bakery === null ? (
                                        <View className='items-center w-full'>
                                            <TextTitle5Gray
                                                label='Silakan daftar kembali melalui tombol di bawah ini'
                                                textStyle={{ textAlign: 'center', marginTop: 10 }}
                                            />
                                            <CustomButton
                                                label='Daftar Bakeri Ulang'
                                                handlePress={() => router.replace("/(auth)/signUpBakery")}
                                                isLoading={false}
                                                buttonStyles='mt-5 w-full'
                                            />
                                        </View>
                                    ) : (
                                        (refreshedUserData?.bakery.isActive === 2 || refreshedUserData?.bakery.isActive === 0) ? (
                                            <View className='items-center w-full'>
                                                <TextTitle5Gray
                                                    label='Untuk informasi lebih lanjut silakan hubungi tim kami melalui tombol di bawah ini'
                                                    textStyle={{ textAlign: 'center', marginTop: 10 }}
                                                />
                                                <ContactButton
                                                    label='Hubungi Kami'
                                                    handlePress={handleContactPress}
                                                    isLoading={false}
                                                    buttonStyles='mt-5 w-full'
                                                />
                                            </View>
                                        ) : (
                                            <View className='items-center w-full'>
                                                <TextTitle5Gray
                                                    label='Silakan masuk kembali melalui tombol di bawah ini'
                                                    textStyle={{ textAlign: 'center', marginTop: 10 }}
                                                />
                                                <CustomButton
                                                    label='Masuk'
                                                    handlePress={signOut}
                                                    isLoading={false}
                                                    buttonStyles='mt-5 w-full'
                                                />
                                            </View>
                                        )
                                    )
                                }
                            </>
                        )
                    }
                </View>
            </View>
        </View>
    );
}

export default PendingApproval