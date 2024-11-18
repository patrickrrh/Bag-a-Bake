import { View, Text, ScrollView, Image, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomLogo from '@/components/CustomLogo'
import TextHeader from '@/components/texts/TextHeader'
import CustomButton from '@/components/CustomButton'
import ErrorMessage from '@/components/texts/ErrorMessage'
import TextHeadline from '@/components/texts/TextHeadline'
import { Link, router, useLocalSearchParams, useRouter } from 'expo-router'
import TextLink from '@/components/texts/TextLink'
import FormField from '@/components/FormField'
import * as ImagePicker from 'expo-image-picker';
import UploadButton from '@/components/UploadButton'
import { images } from '@/constants/images'
import AuthLayout from './authLayout'
import { useAuth } from '@/app/context/AuthContext'
import CustomDropdown from '@/components/CustomDropdown'
import regionApi from '@/api/regionApi';
import { checkEmptyForm } from '@/utils/commonFunctions'
import TextAreaField from '@/components/TextAreaField'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format, toZonedTime } from 'date-fns-tz';
import TimeField from '@/components/TimeField'
import BackButton from '@/components/BackButton'
import ProgressBar from '@/components/ProgressBar'
import { RegionType } from '@/types/types'

type ErrorState = {
    bakeryName: string | null;
    bakeryImage: string | null;
    bakeryDescription: string | null;
    bakeryPhoneNumber: string | null;
    openingTime: string | null;
    closingTime: string | null;
    bakeryRegionId: number | null;
};

const SignUpBakery = () => {

    const { signUp } = useAuth();

    const { userName, userPhoneNumber, email, password, userImage, roleId } = useLocalSearchParams();

    const [form, setForm] = useState({
        bakeryName: '',
        bakeryImage: '',
        bakeryDescription: '',
        bakeryPhoneNumber: '',
        openingTime: '',
        closingTime: '',
        bakeryRegionId: 0,
    })

    const [region, setRegion] = useState<RegionType[]>([]);

    const emptyError: ErrorState = {
        bakeryName: null,
        bakeryImage: null,
        bakeryDescription: null,
        bakeryPhoneNumber: null,
        openingTime: null,
        closingTime: null,
        bakeryRegionId: null,
    }
    const [error, setError] = useState<ErrorState>(emptyError)

    const [isSubmitting, setisSubmitting] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [timeFieldType, setTimeFieldType] = useState<'openingTime' | 'closingTime'>('openingTime');

    const handleGetRegionAPI = async () => {
        try {
            const response = await regionApi().getRegion();
            if (response.status === 200) {
                setRegion(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setForm((prevForm) => ({
            ...prevForm,
            userName: userName,
            userPhoneNumber: userPhoneNumber,
            email: email,
            password: password,
            userImage: userImage,
            roleId: parseInt(roleId as string),
        }));
    }, [userName, userPhoneNumber, email, password, userImage, roleId]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (result) {
            setError((prevError) => ({
                ...prevError,
                bakeryImage: null
            }))
        }

        if (!result.canceled) {
            setForm({ ...form, bakeryImage: result.assets[0].uri })
        }
    };


    const handleSignUpAPI = () => {
        try {
            setisSubmitting(true);

            const errors = checkEmptyForm(form);
            if (Object.values(errors).some(error => error !== null)) {
                setError(errors as ErrorState);
                setisSubmitting(false);
                return;
            }

            signUp(form);
        } catch (error) {
            console.log(error);
        } finally {
            setisSubmitting(false);
        }
    };

    const headerContent = (
        <>
            <View className="flex-row items-center justify-between w-full space-x-4">
                <BackButton />
                <View className="flex-1 mx-2">
                    <ProgressBar progress={0.5} />
                </View>
            </View>
            <View className='items-center'>
                <TextHeader label="Daftar Akun" />
            </View>
        </>
    )

    const footerContent = (
        <>
            <View className='mr-1'>
                <TextHeadline label='Sudah memiliki akun?' />
            </View>
            <TextLink label="Masuk disini" size={14} onPress={() => router.push('/(auth)/signIn')} />
        </>
    );

    useEffect(() => {
        handleGetRegionAPI();
    }, [])

    console.log("form", form)

    const showDatePicker = (type: 'openingTime' | 'closingTime') => {
        setTimeFieldType(type);
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    // const handleSelectTime = (time: any) => {
    //     const timezone = toZonedTime(time, 'Asia/Jakarta');
    //     const formattedTime = format(timezone, 'HH:mm');

    //     if (timeFieldType === 'openingTime') {
    //         setForm((prevForm) => ({ ...prevForm, openingTime: formattedTime }));
    //         setError((prevError) => ({ ...prevError, openingTime: null }));
    //     } else {
    //         setForm((prevForm) => ({ ...prevForm, closingTime: formattedTime }));
    //         setError((prevError) => ({ ...prevError, closingTime: null }));
    //     }

    //     hideDatePicker();
    // };
    const handleSelectTime = (time: Date) => {
        const timezone = toZonedTime(time, "Asia/Jakarta");
        const formattedTime = format(timezone, "HH:mm");

        setForm((prevForm) => ({
            ...prevForm,
            [timeFieldType]: formattedTime,
        }));

        setError((prevError) => ({
            ...prevError,
            [timeFieldType]: null,
        }));

        hideDatePicker();
    };

    return (
        <ScrollView className='bg-background'>
            <AuthLayout headerContent={headerContent} footerContent={footerContent}>
                <FormField
                    label='Nama Toko'
                    value={form.bakeryName}
                    onChangeText={(text) => {
                        setForm((prevForm) => ({ ...prevForm, bakeryName: text }));
                        setError((prevError) => ({ ...prevError, bakeryName: null }));
                    }}
                    keyboardType='default'
                    moreStyles='mt-7'
                    error={error.bakeryName}
                    placeholder='Masukkan nama toko'
                />
                <View className="flex-row space-x-4">
                    <View className='flex-1'>
                        <TimeField
                            label='Jam Buka'
                            value={form.openingTime}
                            onPress={() => showDatePicker('openingTime')}
                            error={error.openingTime}
                            moreStyles='mt-7'
                        />
                    </View>
                    <View className="flex-1">
                        <TimeField
                            label='Jam Tutup'
                            value={form.closingTime}
                            onPress={() => showDatePicker('closingTime')}
                            error={error.closingTime}
                            moreStyles='mt-7'
                        />
                    </View>
                </View>
                <CustomDropdown
                    label='Lokasi'
                    value={form.bakeryRegionId}
                    data={region}
                    placeholder='Pilih lokasi toko'
                    labelField='regionName'
                    valueField='regionId'
                    onChange={(text) => {
                        setForm((prevForm) => ({ ...prevForm, bakeryRegionId: Number(text) }));
                        setError((prevError) => ({ ...prevError, bakeryRegionId: null }));
                    }}
                    moreStyles='mt-7'
                    error={error.bakeryRegionId}
                />
                <FormField
                    label='Nomor Telepon Toko'
                    value={form.bakeryPhoneNumber}
                    onChangeText={(text) => {
                        setForm((prevForm) => ({ ...prevForm, bakeryPhoneNumber: text }));
                        setError((prevError) => ({ ...prevError, bakeryPhoneNumber: null }));
                    }}
                    keyboardType='phone-pad'
                    moreStyles='mt-7'
                    error={error.bakeryPhoneNumber}
                    placeholder='Masukkan nomor telepon toko'
                />
                <TextAreaField
                    label='Deskripsi Toko'
                    value={form.bakeryDescription}
                    onChangeText={(text) => {
                        setForm((prevForm) => ({ ...prevForm, bakeryDescription: text }));
                        setError((prevError) => ({ ...prevError, bakeryDescription: null }));
                    }}
                    keyboardType='default'
                    moreStyles='mt-7'
                    error={error.bakeryDescription}
                    placeholder='Masukkan deskripsi toko'
                />

                <View className="mt-8 w-full flex-row space-x-4">
                    <UploadButton label="Unggah Foto" handlePress={pickImage} />
                    {form.bakeryImage && (
                        <View className="w-24 h-20">
                            <Image
                                source={{ uri: form.bakeryImage }}
                                className="w-full h-full rounded-md"
                            />
                        </View>
                    )}
                </View>
                {error.bakeryImage && (
                    <ErrorMessage label={error.bakeryImage} />
                )}

                <CustomButton
                    label='Daftar'
                    handlePress={() => handleSignUpAPI()}
                    buttonStyles='mt-10 w-full'
                    isLoading={isSubmitting}
                />

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="time"
                    onConfirm={handleSelectTime}
                    onCancel={hideDatePicker}
                />
            </AuthLayout>
        </ScrollView>
    )
}

export default SignUpBakery