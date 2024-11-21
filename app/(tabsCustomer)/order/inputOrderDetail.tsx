import BackButton from '@/components/BackButton';
import CustomButton from '@/components/CustomButton';
import TextOrangeBold from '@/components/texts/TextOrangeBold';
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle4 from '@/components/texts/TextTitle4';
import TextTitle5Bold from '@/components/texts/TextTitle5Bold';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, FlatList, Animated, TouchableOpacity } from 'react-native'
import { Stack, HStack, VStack } from 'react-native-flex-layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calculateTotalOrderPrice, formatRupiah, removeLocalStorage, setLocalStorage } from '@/utils/commonFunctions';
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
import TextEllipsis from '@/components/TextEllipsis';

type Bakery = {
    bakery: Bakery;
    bakeryId: number;
    userId: number;
    bakeryName: string;
    bakeryImage: string;
    bakeryDescription: string;
    bakeryPhoneNumber: string;
    openingTime: string;
    closingTime: string;
    bakeryAddress: string;
    bakeryLatitude: number;
    bakeryLongitude: number;
    product: ProductType[];
    prevRating: {
        averageRating: string;
        reviewCount: string;
    }
};

type OrderItem = {
    bakeryId: number;
    items: {
        productQuantity: number;
        productId: number;
    }[];
};
const InputOrderDetail = () => {

    const { userData } = useAuth();
    const { bakeryId } = useLocalSearchParams();

    const [bakeryDetail, setBakeryDetail] = useState<Bakery | null>(null);
    const [totalPrice, setTotalPrice] = useState("");
    const [orderData, setOrderData] = useState<OrderItem | null>(null);
    const [mappedOrderDetail, setMappedOrderDetail] = useState<{ product: ProductType, productQuantity: number }[]>([]);
    const [orderDetail, setOrderDetail] = useState<OrderDetailType[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchOrderData = async () => {
        try {
            const jsonValue = await getLocalStorage('orderData');
            const data: OrderItem = jsonValue ? JSON.parse(jsonValue) : null;
            console.log("order data", data);
            setOrderData(data);

            const mappedOrderDetail = data?.items.map((item: any) => {
                const product = bakeryDetail?.bakery.product.find(prod => prod.productId === item.productId);
                return {
                    product: product,
                    productQuantity: item.productQuantity
                };
            }) || [];

            setMappedOrderDetail(mappedOrderDetail as { product: ProductType, productQuantity: number }[]);

            if (mappedOrderDetail.length > 0) {
                const total = calculateTotalOrderPrice(mappedOrderDetail);
                setTotalPrice(total);
            } else {
                setTotalPrice("0");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetBakeryByIdApi = async () => {
        try {
            const response = await bakeryApi().getBakeryById({
                bakeryId: parseInt(bakeryId as string),
            })
            if (response.status === 200) {
                setBakeryDetail(response.data ? response.data : {})
                fetchOrderData();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleCreateOrder = async () => {
        try {
            if (!orderData || !userData?.userId) return;

            const formData = {
                userId: userData.userId,
                orderDetail: orderData.items,
                bakeryId: parseInt(bakeryId as string),
            };

            const response = await orderCustomerApi().createOrder(formData);
            if (response.status === 200) {
                router.push('/order');
                removeLocalStorage('orderData');
            }
        } catch (error) {
            console.log(error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            handleGetBakeryByIdApi();
        }, [bakeryId])
    );

    useEffect(() => {
        if (bakeryDetail) {
            fetchOrderData();
        }
    }, [bakeryDetail]);

    return (
        <SafeAreaView className="bg-background h-full flex-1">
            <View className="mx-5">
                <View className="flex-row">
                    <TouchableOpacity
                        onPress={() => {
                            router.replace({
                                pathname: '/bakery/bakeryDetail',
                                params: { bakeryId: bakeryDetail?.bakery.bakeryId },
                            });
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
                        <TextTitle3 label={bakeryDetail?.bakery.bakeryName as string} />
                    </View>
                </View>
            </View>

            <View className='p-5 gap-y-3 mt-5 bg-white'>
                <TextTitle3 label="Detail Toko" />
                <View className='flex-row'>
                    <TextTitle5 label={`Jam pengambilan terakhir: `} />
                    <TextTitle5Bold label={bakeryDetail?.bakery.closingTime as string} color='#FA6F33' />
                </View>
                <View className='flex-row w-4/5'>
                    <TextTitle5 label={`Lokasi: `} />
                    <TextTitle5Bold label={bakeryDetail?.bakery.bakeryAddress as string} />
                </View>
            </View>

            <View className='p-5 gap-y-3 mt-5 bg-white'>
                <TextTitle3 label="Ringkasan Pesanan" />
                {mappedOrderDetail.map((item, index) => (
                    <View key={index} className='flex-row justify-between'>
                        <View style={{ flexDirection: 'row', columnGap: 8 }}>
                            <TextTitle5 label={item.productQuantity} />
                            <TextTitle5 label={item.product?.productName} />
                        </View>
                        <View className='flex-col items-end'>
                            <View className='flex-row'>
                                <View className='mr-1'>
                                    <TextTitle5 label={formatRupiah(Number(item.product?.productPrice) * item.productQuantity)} textStyle={{ textDecorationLine: 'line-through' }} />
                                </View>
                                <TextDiscount label={item.product?.discountPercentage} />
                            </View>
                            <TextTitle5 label={formatRupiah(Number(item.product?.todayPrice) * item.productQuantity)} />
                        </View>
                    </View>
                ))}
            </View>

            <View className='p-5 mt-5 bg-white'>
                <View className='flex-row justify-between'>
                    <TextTitle4 label="Total" />
                    <TextTitle5 label={`${totalPrice}`} />
                </View>
            </View>

            <View className="mx-5 mt-10 ">
                <CustomButton
                    label="Pesan"
                    handlePress={() => handleCreateOrder()}
                    buttonStyles="w-full"
                    isLoading={isSubmitting}
                />
            </View>
        </SafeAreaView>

    )
}

export default InputOrderDetail