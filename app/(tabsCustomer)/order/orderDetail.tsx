import BackButton from '@/components/BackButton';
import CustomButton from '@/components/CustomButton';
import TextOrangeBold from '@/components/texts/TextOrangeBold';
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle4 from '@/components/texts/TextTitle4';
import TextTitle5Bold from '@/components/texts/TextTitle5Bold';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, FlatList, Animated, TouchableOpacity, Linking, ScrollView, Alert } from 'react-native'
import { Stack, HStack, VStack } from 'react-native-flex-layout';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { calculateTotalOrderPrice, calculateValidPaymentTime, convertPhoneNumberFormat, encodeImage, formatDatewithtime, formatRupiah, removeLocalStorage, setLocalStorage } from '@/utils/commonFunctions';
import { getLocalStorage } from '@/utils/commonFunctions';
import bakeryApi from '@/api/bakeryApi';
import { useFocusEffect, useLocalSearchParams, router } from 'expo-router';
import orderCustomerApi from '@/api/orderCustomerApi';
import { useAuth } from '@/app/context/AuthContext';
import TextTitle5 from '@/components/texts/TextTitle5';
import { OrderDetailType, PaymentType, ProductType } from '@/types/types';
import TextDiscount from '@/components/texts/TextDiscount';
import TextBeforePrice from '@/components/texts/TextBeforePrice';
import TextAfterPrice from '@/components/texts/TextAfterPrice';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import TextTitle5Date from '@/components/texts/TextTitle5Date';
import ContactButton from '@/components/ContactButton';
import TextEllipsis from '@/components/TextEllipsis';
import ModalAction from '@/components/ModalAction';
import TextHeadline from '@/components/texts/TextHeadline';
import paymentApi from "@/api/paymentApi";
import ModalInformation from '@/components/ModalInformation';
import UploadButton from '@/components/UploadButton';
import UploadPayment from '@/components/UploadPayment';
import * as ImagePicker from 'expo-image-picker';
import TextTitle5Gray from '@/components/texts/TextTitle5Gray';
import ImageView from "react-native-image-viewing";
import { handleDownloadImage } from '@/utils/mediaUtils';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { showToast } from '@/utils/toastUtils';

type ErrorState = {
    proofOfPayment: string | null;
}

const OrderDetail = () => {

    const insets = useSafeAreaInsets();

    const { order } = useLocalSearchParams();
    const orderData = order ? JSON.parse(order as string) : null;

    const [paymentMethods, setPaymentMethods] = useState<PaymentType[]>([]);

    const emptyError: ErrorState = {
        proofOfPayment: null
    }
    const [error, setError] = useState<ErrorState>(emptyError);

    const [isSubmitting, setisSubmitting] = useState(false);
    const [isCancelModalVisible, setCancelModalVisible] = useState(false);
    const [paymentInfoModal, setPaymentInfoModal] = useState(false);
    const [proofOfPayment, setProofOfPayment] = useState('');
    const [isShowPayment, setIsShowPayment] = useState(false);
    const [isPreviewQRIS, setIsPreviewQRIS] = useState(false);

    const handleContactSeller = (phoneNumber: string) => {
        const formattedPhoneNumber = convertPhoneNumberFormat(phoneNumber);
        const url = `https://wa.me/${formattedPhoneNumber}`;

        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    console.log('Can\'t handle url: ' + url);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    }

    const handleCopyToClipboard = async (text: string) => {
        await Clipboard.setStringAsync(text);
        showToast('success', 'Nomor berhasil disalin');
      };

    const handleCancelOrderApi = async () => {
        try {
            const isUpdateStock = orderData.orderStatus === 2 ? true : false
            await orderCustomerApi().cancelOrder({ orderId: orderData.orderId, bakeryId: orderData.bakery.bakeryId, isUpdateStock: isUpdateStock });
            router.push("/order");
        } catch (error) {
            console.log("Error canceling order ", error)
        }
    }

    const handleGetPaymentMethodsByBakeryAPI = async () => {
        try {
            const response = await paymentApi().getPaymentByBakery({
                bakeryId: orderData.bakery.bakeryId
            })
            if (response.status === 200) {
                setPaymentMethods(response.data ? response.data : []);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetPaymentMethodsByBakeryAPI();
    }, [])

    useEffect(() => {
        if (orderData.proofOfPayment && orderData.proofOfPayment !== '') {
            setProofOfPayment(orderData.proofOfPayment)
            setIsShowPayment(true)
        }
    }, [orderData])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (result) {
            setError((prevError) => ({
                ...prevError,
                proofOfPayment: null,
            }));
        }

        if (!result.canceled) {
            setProofOfPayment(result.assets[0].uri)
        }
    };

    const handleSubmitProofOfPaymentAPI = async () => {
        try {
            let encodedProofOfPayment = null;
            if (proofOfPayment) {
                encodedProofOfPayment = await encodeImage(proofOfPayment);
            }

            const response = await orderCustomerApi().submitProofOfPayment({
                orderId: orderData.orderId,
                proofOfPayment: encodedProofOfPayment,
                bakeryId: orderData.bakery.bakeryId
            })

            if (response.status === 200) {
                router.back();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View className="bg-background h-full flex-1">

            <View style={{ height: insets.top }} />

            <View className="mx-5 mb-5">
                <View className="flex-row">
                    <TouchableOpacity
                        onPress={() => {
                            router.replace({
                                pathname: '/order' as any,
                            })
                            setLocalStorage('orderCustomerParams', JSON.stringify({ status: orderData.orderStatus }))
                        }}
                        activeOpacity={0.7}
                        style={{ width: 10, height: 24 }}
                    >
                        <FontAwesome
                            name="angle-left"
                            size={24}
                            color="#000"
                        />
                    </TouchableOpacity>
                    <View className="flex-1 items-center pr-3">
                        <TextTitle3 label={orderData.bakery.bakeryName as string} />
                        <TextTitle5Date label={formatDatewithtime(orderData.orderDate)} />
                    </View>
                </View>
            </View>

            <ScrollView>

                <View className='p-5 gap-y-3 bg-white'>
                    <TextTitle3 label="Detail Toko" />
                    <View className='flex-row'>
                        <TextTitle5 label={`Jam pengambilan terakhir: `} />
                        <TextTitle5Bold label={orderData.bakery.closingTime as string} color='#FA6F33' />
                    </View>
                    <View className='flex-row w-4/5'>
                        <TextTitle5 label={`Lokasi: `} />
                        <TextTitle5Bold label={orderData.bakery.bakeryAddress as string} />
                    </View>
                </View>

                <View className='p-5 gap-y-3 mt-5 bg-white'>
                    <TextTitle3 label="Ringkasan Pesanan" />
                    {orderData.orderDetail.map((item: OrderDetailType) => (
                        <View key={item.orderDetailId} className='flex-row justify-between'>
                            <View style={{ flexDirection: 'row', columnGap: 8 }}>
                                <TextTitle5 label={item.productQuantity} />
                                <TextTitle5 label={item.product.productName} />
                            </View>
                            <View className='flex-col items-end'>
                                <View className='flex-row'>
                                    <View className='mr-1'>
                                        <TextTitle5 label={formatRupiah(Number(item.product.productPrice) * item.productQuantity)} textStyle={{ textDecorationLine: 'line-through' }} />
                                    </View>
                                    <TextDiscount label={item.discountPercentage} />
                                </View>
                                <TextTitle5 label={formatRupiah(item.totalDetailPrice)} />
                            </View>
                        </View>
                    ))}
                </View>

                <View className='p-5 mt-5 bg-white'>
                    <View className='flex-row justify-between'>
                        <TextTitle4 label="Total" />
                        <TextTitle5 label={formatRupiah(orderData.totalOrderPrice)} />
                    </View>
                </View>

                {
                    orderData.orderStatus === 2 && (
                        <View className='p-5 mt-5 bg-white flex-row justify-between'>
                            <View>
                                <View className='flex-row items-center space-x-1'>
                                    <TextTitle4 label="Metode Pembayaran" />
                                    <Ionicons name="information-circle-outline" size={14} color="gray" onPress={() => setPaymentInfoModal(true)} />
                                </View>
                                <View className='flex-row'>
                                    <View className='mr-1'>
                                        <TextTitle5Gray label={`Konfirmasi sebelum`} />
                                    </View>
                                    <TextTitle5Bold label={calculateValidPaymentTime(orderData.paymentStartedAt)} color='#FA6F33' />
                                </View>
                                <FlatList
                                    data={paymentMethods}
                                    renderItem={({ item }) => (
                                        <View>
                                            {
                                                item.paymentMethod === 'QRIS' ? (
                                                    <View className='mt-2'>
                                                        <View className='flex-row items-center'>
                                                            <TextTitle5 label='• ' />
                                                            <TextTitle4 label={item.paymentMethod} />
                                                            <TouchableOpacity className='ml-1 pb-1'>
                                                                <Ionicons name='download-outline' size={18} color="gray" onPress={() => handleDownloadImage('images/bakery-qris', item.paymentDetail)} />
                                                            </TouchableOpacity>
                                                        </View>
                                                        <TouchableOpacity onPress={() => setIsPreviewQRIS(true)}>
                                                            <Image
                                                                source={{ uri: `${process.env.EXPO_PUBLIC_LOCAL_SERVER}/images/bakery-qris/${item.paymentDetail}` }}
                                                                className='ml-2 mt-1 w-28 h-28'
                                                            />
                                                        </TouchableOpacity>
                                                        <ImageView
                                                            images={[{ uri: `${process.env.EXPO_PUBLIC_LOCAL_SERVER}/images/bakery-qris/${item.paymentDetail}` }]}
                                                            imageIndex={0}
                                                            visible={isPreviewQRIS}
                                                            onRequestClose={() => setIsPreviewQRIS(false)}
                                                        />
                                                    </View>
                                                ) : (
                                                    <View className='mt-2'>
                                                        <View className='flex-row items-center'>
                                                            <TextTitle5 label='• ' />
                                                            <TextTitle4 label={item.paymentMethod} />
                                                        </View>
                                                        <View className='flex-row ml-2 mt-1'>
                                                            <TextTitle5 label={`${item.paymentService}: `} />
                                                            <TextTitle5 label={item.paymentDetail} />
                                                            <TouchableOpacity className='ml-1'>
                                                                <Ionicons name='copy-outline' size={14} color="gray" onPress={() => handleCopyToClipboard(item.paymentDetail as string)} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                )
                                            }
                                        </View>
                                    )}
                                    keyExtractor={(item) => item.paymentId.toString()}
                                    scrollEnabled={false}
                                />
                            </View>
                            <View>
                                <UploadPayment
                                    handlePress={pickImage}
                                    proofOfPayment={proofOfPayment}
                                    isDisabled={isShowPayment}
                                />
                            </View>
                        </View>
                    )
                }

                <ModalAction
                    setModalVisible={setCancelModalVisible}
                    modalVisible={isCancelModalVisible}
                    title="Apakah Anda yakin ingin membatalkan pesanan ini?"
                    primaryButtonLabel="Kembali"
                    secondaryButtonLabel="Batalkan Pesanan"
                    onPrimaryAction={() => setCancelModalVisible(false)}
                    onSecondaryAction={handleCancelOrderApi}
                />

                <ModalInformation
                    visible={paymentInfoModal}
                    onClose={() => setPaymentInfoModal(false)}
                    title='Informasi Pembayaran'
                    content='Pesanan akan otomatis dibatalkan jika tidak mengirimkan konfirmasi pembayaran sebelum waktu yang ditentukan.'
                />

            </ScrollView>

            {
                orderData.orderStatus === 1 ? (
                    <View className='mx-5 my-5'>
                        <CustomButton
                            label="Hubungi Penjual"
                            handlePress={() => handleContactSeller(orderData.bakery.bakeryPhoneNumber as string)}
                            isLoading={isSubmitting}
                        />
                        <ContactButton
                            label="Batalkan Pesanan"
                            handlePress={() => setCancelModalVisible(true)}
                            buttonStyles='mt-3'
                            isLoading={isSubmitting}
                        />
                    </View>
                ) : orderData.orderStatus === 2 ? (
                    <View className='mx-5 my-5'>
                        {
                            isShowPayment === false && (
                                <CustomButton
                                    label="Konfirmasi Pembayaran"
                                    handlePress={() => handleSubmitProofOfPaymentAPI()}
                                    isLoading={isSubmitting}
                                    disabled={proofOfPayment === ''}
                                />
                            )
                        }
                        <ContactButton
                            label="Batalkan Pesanan"
                            handlePress={() => setCancelModalVisible(true)}
                            buttonStyles='mt-3'
                            isLoading={isSubmitting}
                        />
                        <ContactButton
                            label="Hubungi Penjual"
                            handlePress={() => handleContactSeller(orderData.bakery.bakeryPhoneNumber as string)}
                            buttonStyles='mt-3'
                            isLoading={isSubmitting}
                        />
                    </View>
                ) : orderData.orderStatus === 3 && (
                    <View className='mx-5 my-5'>
                        <ContactButton
                            label="Hubungi Penjual"
                            handlePress={() => handleContactSeller(orderData.bakery.bakeryPhoneNumber as string)}
                            buttonStyles='mt-3'
                            isLoading={isSubmitting}
                        />
                    </View>
                )
            }

        </View>

    )
}

export default OrderDetail