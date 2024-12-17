import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthLayout from './authLayout'
import BackButton from '@/components/BackButton'
import ProgressBar from '@/components/ProgressBar'
import TextHeader from '@/components/texts/TextHeader'
import TextHeadline from '@/components/texts/TextHeadline'
import TextLink from '@/components/texts/TextLink'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';
import UploadButton from '@/components/UploadButton'
import ErrorMessage from '@/components/texts/ErrorMessage'
import RadioButtonInput from '@/components/PaymentInput'
import PaymentInput from '@/components/PaymentInput'
import CustomButton from '@/components/CustomButton'
import authenticationApi from '@/api/authenticationApi';
import { Ionicons } from '@expo/vector-icons'
import ModalAction from '@/components/ModalAction'
import * as FileSystem from 'expo-file-system';
import { encodeImage } from '@/utils/commonFunctions'

type ErrorState = {
    paymentMethod: string | null;
}

interface PaymentMethod {
    method: string;
    serviceOptions?: string[];
}

const SignUpPaymentInfo = () => {

    const { refreshUserStatus, userData, signOut } = useAuth();
    const { prevForm } = useLocalSearchParams();
    const parsedPrevForm = prevForm && typeof prevForm === 'string' ? JSON.parse(prevForm) : {};

    const emptyForm = {
        paymentMethods: [] as { paymentMethod: string; paymentService: string, paymentDetail: string }[],
    }
    const [form, setForm] = useState(emptyForm);

    const emptyError: ErrorState = {
        paymentMethod: null,
    }
    const [error, setError] = useState<ErrorState>(emptyError);

    const [isSubmitting, setisSubmitting] = useState(false);

    const paymentMethods: PaymentMethod[] = [
        { method: 'Transfer Bank', serviceOptions: ['BCA', 'Mandiri', 'BNI', 'BRI'] },
        { method: 'E-Wallet', serviceOptions: ['Gopay', 'Dana', 'OVO'] },
        { method: 'QRIS' }
    ];

    const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [isPaymentQrisUpdated, setIsPaymentQrisUpdated] = useState(false);

    useEffect(() => {
        setForm((prevForm) => ({
            ...prevForm,
            ...parsedPrevForm,
        }))
    }, [prevForm])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })


        if (!result.canceled) {
            setIsPaymentQrisUpdated(true);
            setForm((prevForm) => {
                const updatedPaymentMethods = prevForm.paymentMethods.map((method) => {
                    if (method.paymentMethod === 'QRIS') {
                        return { ...method, paymentDetail: result.assets[0].uri };
                    }
                    return method;
                });

                return { ...prevForm, paymentMethods: updatedPaymentMethods };
            });
        }
    };

    const handlePaymentMethodSelect = (method: string) => {
        setError((prevError) => ({ ...prevError, paymentMethod: null }));

        const updatedMethods = selectedMethods.includes(method)
            ? selectedMethods.filter((m) => m !== method)
            : [...selectedMethods, method];

        setSelectedMethods(updatedMethods);

        setForm((prevForm) => {
            const existingMethods = prevForm.paymentMethods || [];
            const updatedMethodsList = updatedMethods.map((method) => {
                if (method === 'QRIS') {
                    const existingQRIS = existingMethods.find((entry) => entry.paymentMethod === 'QRIS');
                    return existingQRIS || { paymentMethod: 'QRIS', paymentService: 'QRIS', paymentDetail: '' };
                }

                const existing = existingMethods.find((entry) => entry.paymentMethod === method);
                return existing || { paymentMethod: method, paymentService: '', paymentDetail: '' };
            });

            return { ...prevForm, paymentMethods: updatedMethodsList };
        });
    };


    const handleDropdownSelect = (method: string, service: string) => {
        setForm((prevForm) => {
            const updatedMethods = (prevForm.paymentMethods || []).map((entry) =>
                entry.paymentMethod === method
                    ? { ...entry, paymentService: service }
                    : entry
            );

            return { ...prevForm, paymentMethods: updatedMethods };
        });
    };


    const handleTextChange = (method: string, detail: string) => {
        setForm((prevForm) => {
            const updatedMethods = prevForm.paymentMethods.map((payment: any) =>
                payment.paymentMethod === method
                    ? { ...payment, paymentDetail: detail }
                    : payment
            );
            return {
                ...prevForm,
                paymentMethods: updatedMethods,
            };
        });
    };


    const handleSignUpBakeryAPI = async () => {
        try {
            setisSubmitting(true);

            if (form.paymentMethods.length === 0) {
                setError((prevError) => ({
                    ...prevError,
                    paymentMethod: 'Silakan pilih minimal 1 metode pembayaran',
                }));
                return;
            }

            const incompleteMethods = form.paymentMethods.filter(
                (method) => !method.paymentService || !method.paymentDetail
            );

            if (incompleteMethods.length > 0) {
                const errorMessage = incompleteMethods
                    .map((method) => method.paymentMethod)
                    .join(', ');

                setError((prevError) => ({
                    ...prevError,
                    paymentMethod: `Silakan lengkapi detail untuk metode pembayaran: ${errorMessage}`,
                }));
                return;
            }

            let encodedQrisImage: string | null = null;
            const qrisMethod = form.paymentMethods.find((method) => method.paymentMethod === 'QRIS');

            if (qrisMethod) {
                encodedQrisImage = await encodeImage(qrisMethod.paymentDetail);
                if (encodedQrisImage) {
                    qrisMethod.paymentDetail = encodedQrisImage;
                }
            }

            const res = await authenticationApi().signUpBakery({
                ...form,
                userId: userData?.userId
            });

            if (res.status === 201) {
                refreshUserStatus();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setisSubmitting(false);
        }
    }

    const headerContent = (
        <>
            <View className="flex-row items-center justify-between w-full space-x-4">
                <BackButton />
                <View className="flex-1 mx-2">
                    <ProgressBar progress={0.5} />
                </View>
                <TouchableOpacity
                    onPress={() => setLogoutModalVisible(true)}
                >
                    <Ionicons name="log-out-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>
            <View className='items-center'>
                <TextHeader label="Metode Pembayaran" />
            </View>
        </>
    )

    return (
        <AuthLayout headerContent={headerContent}>
            <View className='mt-8'>
                <PaymentInput
                    paymentMethods={paymentMethods}
                    selectedMethods={selectedMethods}
                    form={form.paymentMethods || []}
                    selectMethod={handlePaymentMethodSelect}
                    selectDropdown={handleDropdownSelect}
                    onChangeText={handleTextChange}
                    pickImage={pickImage}
                    isLoadQris={isPaymentQrisUpdated}
                />
            </View>
            {
                error.paymentMethod && (
                    <ErrorMessage label={error.paymentMethod} />
                )
            }

            <CustomButton
                label='Daftar'
                handlePress={() => handleSignUpBakeryAPI()}
                buttonStyles='mt-10 w-full'
                isLoading={isSubmitting}
            />

            <ModalAction
                setModalVisible={setLogoutModalVisible}
                modalVisible={logoutModalVisible}
                title="Apakah Anda yakin ingin keluar?"
                secondaryButtonLabel="Iya"
                primaryButtonLabel="Tidak"
                onSecondaryAction={() => signOut()}
                onPrimaryAction={() => setLogoutModalVisible(false)}
            />
        </AuthLayout>
    )
}

export default SignUpPaymentInfo