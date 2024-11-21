import BackButton from '@/components/BackButton';
import CustomButton from '@/components/CustomButton';
import TextOrangeBold from '@/components/texts/TextOrangeBold';
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle4 from '@/components/texts/TextTitle4';
import TextTitle5Bold from '@/components/texts/TextTitle5Bold';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, FlatList, Animated, TouchableOpacity, Linking } from 'react-native'
import { Stack, HStack, VStack } from 'react-native-flex-layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calculateTotalOrderPrice, convertPhoneNumberFormat, formatDatewithtime, formatRupiah, removeLocalStorage, setLocalStorage } from '@/utils/commonFunctions';
import { getLocalStorage } from '@/utils/commonFunctions';
import bakeryApi from '@/api/bakeryApi';
import { useFocusEffect, useLocalSearchParams, router } from 'expo-router';
import orderCustomerApi from '@/api/orderCustomerApi';
import { useAuth } from '@/app/context/AuthContext';
import TextTitle5 from '@/components/texts/TextTitle5';
import { OrderDetailType, ProductType } from '@/types/types';
import TextDiscount from '@/components/texts/TextDiscount';
import TextBeforePrice from '@/components/texts/TextBeforePrice';
import TextAfterPrice from '@/components/texts/TextAfterPrice';
import { FontAwesome } from '@expo/vector-icons';
import TextTitle5Date from '@/components/texts/TextTitle5Date';
import ContactButton from '@/components/ContactButton';
import TextEllipsis from '@/components/TextEllipsis';
import ModalAction from '@/components/ModalAction';

const OrderDetail = () => {

    const { order } = useLocalSearchParams();
    const orderData = order ? JSON.parse(order as string) : null;

    const [isSubmitting, setisSubmitting] = useState(false);
    const [isCancelModalVisible, setCancelModalVisible] = useState(false);

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

    const handleCancelOrderApi = async () => {
        try {
            await orderCustomerApi().cancelOrder({ orderId: orderData.orderId });
            router.push("/order");
        } catch (error) {
            console.log("Error canceling order ", error)
        }
    }

    return (
        <SafeAreaView className="bg-background h-full flex-1">
            <View className="mx-5">
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

            <View className='p-5 gap-y-3 mt-5 bg-white'>
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
                    <TextTitle5 label={calculateTotalOrderPrice(orderData.orderDetail)} />
                </View>
            </View>

            {
                orderData.orderStatus === 1 ? (
                    <View className='mx-5 mt-10'>
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
                    <View className='mx-5 mt-10'>
                        <CustomButton
                            label="Hubungi Penjual"
                            handlePress={() => handleContactSeller(orderData.bakery.bakeryPhoneNumber as string)}
                            isLoading={isSubmitting}
                        />
                    </View>
                ) : null
            }

            {
                isCancelModalVisible && (
                    <ModalAction
                        setModalVisible={setCancelModalVisible}
                        modalVisible={isCancelModalVisible}
                        title="Apakah Anda yakin ingin membatalkan pesanan ini?"
                        primaryButtonLabel="Kembali"
                        secondaryButtonLabel="Batalkan Pesanan"
                        onPrimaryAction={() => setCancelModalVisible(false)}
                        onSecondaryAction={handleCancelOrderApi}
                    />
                )
            }

        </SafeAreaView>

    )
}

export default OrderDetail