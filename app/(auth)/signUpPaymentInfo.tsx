import { View, Text, Image } from 'react-native'
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

type ErrorState = {
    paymentMethod: string | null;
}

interface PaymentMethod {
    method: string;
    serviceOptions?: string[];
}

const SignUpPaymentInfo = () => {

    const { signUp } = useAuth();
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

    useEffect(() => {
        setForm((prevForm) => ({
            ...prevForm,
            ...parsedPrevForm,
            roleId: parseInt(parsedPrevForm.roleId),
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


    const handleSignUpAPI = async () => {
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

            signUp(form);
        } catch (error) {
            console.log(error);
        } finally {
            setisSubmitting(false);
        }
    }

    console.log("Form at payment: ", JSON.stringify(form, null, 2));

    const headerContent = (
        <>
            <View className="flex-row items-center justify-between w-full space-x-4">
                <BackButton />
                <View className="flex-1 mx-2">
                    <ProgressBar progress={0.7} />
                </View>
            </View>
            <View className='items-center'>
                <TextHeader label="Metode Pembayaran" />
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

    return (
        <AuthLayout headerContent={headerContent} footerContent={footerContent}>
            <View className='mt-8'>
                <PaymentInput
                    paymentMethods={paymentMethods}
                    selectedMethods={selectedMethods}
                    form={form.paymentMethods || []}
                    selectMethod={handlePaymentMethodSelect}
                    selectDropdown={handleDropdownSelect}
                    onChangeText={handleTextChange}
                    pickImage={pickImage}
                />
            </View>
            {
                error.paymentMethod && (
                    <ErrorMessage label={error.paymentMethod} />
                )
            }

            <CustomButton
                label='Daftar'
                handlePress={() => handleSignUpAPI()}
                buttonStyles='mt-10 w-full'
                isLoading={isSubmitting}
            />
        </AuthLayout>
    )
}

export default SignUpPaymentInfo