import BackButton from '@/components/BackButton';
import CustomButton from '@/components/CustomButton';
import TextOrangeBold from '@/components/texts/TextOrangeBold';
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle4 from '@/components/texts/TextTitle4';
import TextTitle5Bold from '@/components/texts/TextTitle5Bold';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacityBase, Animated } from 'react-native'
import { Stack, HStack, VStack } from 'react-native-flex-layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calculateTotalOrderPrice, removeLocalStorage } from '@/utils/commonFunctions';
import { getLocalStorage } from '@/utils/commonFunctions';
import bakeryApi from '@/api/bakeryApi';
import { useFocusEffect, useLocalSearchParams, router } from 'expo-router';
import orderCustomerApi from '@/api/orderCustomerApi';

type Bakery = {
    bakeryId: number;
    userId: number;
    bakeryName: string;
    bakeryImage: string;
    bakeryDescription: string;
    bakeryPhoneNumber: string;
    openingTime: string;
    closingTime: string;
    regionId: number;
    regionBakery: RegionBakery;
    product: Product[];
};

type RegionBakery = {
    regionId: number;
    regionName: string;
};

type Product = {
    productId: number;
    bakeryId: number;
    categoryId: number;
    productName: string;
    productPrice: string;
    productImage: string;
    productDescription: string;
    productExpirationDate: string;
    productStock: number;
    isActive: number;
}
type OrderItem = {
    bakeryId: number;
    items: {
        orderQuantity: number;
        productId: number;
    }[];
};
const OrderDetail = () => {
    const { bakeryId } = useLocalSearchParams();
    const [bakeryDetail, setBakeryDetail] = useState<Bakery | null>(null);
    const [totalPrice, setTotalPrice] = useState<number>(0.0);
    const [orderData, setOrderData] = useState<OrderItem | null>(null);
    const [mappedOrderDetail, setMappedOrderDetail] = useState<{ product: Product, productQuantity: number }[]>([]);
    const fetchOrderData = async () => {
        try {
            if (!bakeryDetail) return;

            const jsonValue = await getLocalStorage('orderData');
            const data: OrderItem = jsonValue ? JSON.parse(jsonValue) : null;
            setOrderData(data);
    
            // Calculate Total Order Price
            const products = bakeryDetail?.product || [];
    
            const mappedOrderDetail = data?.items.map((item: any) => {
                const product = products.find(prod => prod.productId === item.productId);
                return {
                    product: product ?? { productId: 0, bakeryId: 0, categoryId: 0, productName: '', productPrice: '', productImage: '', productDescription: '', productExpirationDate: '', productStock: 0, isActive: 0 }, 
                    productQuantity: item.orderQuantity
                };
            }) || [];
    
            setMappedOrderDetail(mappedOrderDetail);
            console.log("Helloooo", mappedOrderDetail); 

            if (mappedOrderDetail.length > 0) {
                const total = calculateTotalOrderPrice(mappedOrderDetail);
                setTotalPrice(total);
            } else {
                setTotalPrice(0);
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
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUserId = async () => {
        try {
            const userData = await getLocalStorage('userData');

            if (userData) {
                const parsedUserData = JSON.parse(userData);
                return parsedUserData.userId;
            } else {
                return null;
            }
        } catch (error) {
            console.log("Failed retrieving user data: ", error);
            return null;
        }
    }

    console.log("USERID", fetchUserId()); 
    console.log("ORDER DATA", orderData);
    console.log("BAKERY DETAIL", bakeryId)

    const handleCreateOrder = async () => {
        try {
            const userId = await fetchUserId();
            console.log("INI PENANDA APAKAH ADA")
            if (!orderData) return;

            console.log("TIDAKKKK MASUKKKK", userId)

            const orderDetail = {
                create: orderData.items.map(item => ({ 
                    productId: item.productId,
                    productQuantity: item.orderQuantity,
                }))
            };
            console.log("MASUK")
            console.log("OrderDetail: ", orderDetail.create);

            const formData = {
                userId: 1,
                orderDetail: orderDetail.create,
                bakeryId: 1,
            };

            console.log("INI FORM DATA", formData);

            const response = await orderCustomerApi().createOrder(formData);
            console.log("HASILNYA APA", response);
            if (response.status === 200) {
                console.log("Berhasilll", response)
                await removeLocalStorage('orderData');
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        handleGetBakeryByIdApi();
        fetchOrderData()
    }, [bakeryId]);

    useFocusEffect(
        useCallback(() => {
            fetchOrderData();
        }, [])
    );

    return (
        <SafeAreaView className="bg-background h-full flex-1">
            <View className="mx-5">
                <View className="flex-row">
                    <BackButton />
                    <View className="flex-1 items-center pr-3">
                        <TextTitle3 label="10 Juni 2024 15:39" />
                    </View>
                </View>

                {/* <Image 
                    source={require('../../assets/images/map.png')}
                    style={{ width: 353, height: 177, marginTop: 40 }}
                /> */}
            </View>
            <View className="flex-row mt-10 bg-white">
                {/* <Image 
                    source={require('../../assets/images/profile.jpg')}
                style={{ width: 40, height: 40, borderRadius: 48, marginTop: 8, marginBottom: 8, marginLeft: 20 }}
                /> */}

                <View className="ml-4 my-2">
                    <TextTitle4 label={bakeryDetail?.bakeryName as string} />
                    <View className="flex-row mt-1">
                        <Text>Jam Pengambilan Terakhir: </Text> 
                        <TextOrangeBold label="21.00" />
                    </View>
                </View>
            </View>

            <View className="mt-4 bg-white">
                <View className="mx-5 my-3">
                    <TextTitle4 label="Ringkasan Pesanan" />
                    {mappedOrderDetail.map((item, index) => (
                        <View key={index} className="flex-row justify-between mt-4">
                            <View className="flex-row">
                                <View className="mr-4">
                                    <TextTitle5Bold label={`${item.productQuantity}x`} />
                                </View>
                                <Text>{item.product.productName}</Text>
                            </View>
                            <Text>Rp {(parseFloat(item.product.productPrice) * item.productQuantity)}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View className="mt-4 bg-white">
                <View className="mx-5 my-3">
                    <View className="flex-row justify-between">
                        <TextTitle4 label="Total" />
                        <TextTitle4 label={`Rp ${totalPrice}`} />
                    </View>
                </View>
            </View>

            <View className="absolute bottom-0 left-0 right-0 mb-5 mx-5 ">
                <CustomButton label="Pesan" handlePress={async () => {
                    await handleCreateOrder();

                    router.push({
                        pathname: '/bakery/inputOrder',
                    });
                }} buttonStyles="w-full" isLoading={false} />
            </View>
        </SafeAreaView>

    )
}

export default OrderDetail