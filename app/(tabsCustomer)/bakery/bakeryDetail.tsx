import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Alert,
    Button,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, router } from 'expo-router';
import ProductCardBakery from '@/components/ProductCardBakery';
import CustomClickableButton from '@/components/CustomClickableButton';
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextTitle5Bold from '@/components/texts/TextTitle5Bold';
import bakeryApi from '@/api/bakeryApi';
import BackButton from '@/components/BackButton';
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { FontAwesome } from '@expo/vector-icons';

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
    productId: number;
    productQuantity: number;
    productPrice: number;
};

const BakeryDetail = () => {

    const { productId, bakeryId } = useLocalSearchParams();
    const [bakeryDetail, setBakeryDetail] = useState<Bakery | null>(null);
    const [isSubmitting, setisSubmitting] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderData, setOrderData] = useState<OrderItem[]>([]);

    const fetchOrderData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('orderData');
            const data: OrderItem[] = jsonValue ? JSON.parse(jsonValue) : [];
            const filteredData = data.filter(
                (item: OrderItem) => bakeryDetail?.product.some((product) => product.productId === item.productId)
            );

            setOrderData(filteredData);

            // Calculate total price
            const total = filteredData.reduce(
                (sum, item) => sum + (item.productQuantity * item.productPrice),
                0
            );
            setTotalPrice(total);

        } catch (error) {
            console.log(error);
        }
    };

    const handleGetBakeryByProductApi = async () => {
        try {

            const response = await bakeryApi().getBakeryByProduct({
                productId: parseInt(productId as string),
            })
            if (response.status === 200) {
                setBakeryDetail(response.data ? response.data : {})
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleGetBakeryByIdApi = async () => {
        try {
            const response = await bakeryApi().getBakeryById({
                bakeryId: parseInt(bakeryId as string),
            })
            console.log("response", response)
            if (response.status === 200) {
                setBakeryDetail(response.data ? response.data : {})
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        console.log("test", productId)
        handleGetBakeryByProductApi()
    }, [productId])

    useEffect(() => {
        handleGetBakeryByIdApi()
    }, [bakeryId])

    useEffect(() => {
        fetchOrderData()
    }, [bakeryId])

    return (
        <SafeAreaView className="bg-background h-full flex-1">
            <ScrollView className="px-5">
                <View className="flex-row">
                    <BackButton />
                    <View className="flex-1 items-center pr-3">
                        <TextTitle3 label={bakeryDetail?.bakeryName as string} />
                    </View>
                    <TouchableOpacity onPress={() => { }} className="flex-2 items-center">
                        <Ionicons
                            // name={favorites.includes(store.id) ? "heart" : "heart-outline"}
                            name='heart-outline'
                            size={24}
                            // color={favorites.includes(store.id) ? "red" : "black"}
                            color='black'
                        />
                    </TouchableOpacity>
                </View>

                <Image
                    source={images.logo}
                    className='w-full h-40 mt-5 rounded-xl border border-gray-500'
                />

                <View className="mt-5">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">

                        </View>
                        <View>
                            <CustomClickableButton label={"Buka Toko"} handlePress={() => { }} buttonStyles={"bg-brown"} isLoading={false} icon="map" />
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <View className="pr-1">
                            <FontAwesome6 name="location-dot" size={14} color="black" />
                        </View>
                        <View className="pr-1 pt-1">
                            <TextTitle5 label={bakeryDetail?.regionBakery?.regionName as string} />
                        </View>
                    </View>

                    <View className="mt-2">
                        <CustomClickableButton
                            label={"Hubungi Bakeri"}
                            handlePress={() => { }}
                            isLoading={isSubmitting}
                            icon="whatsapp"
                            iconColor='#25D366'
                        />
                    </View>

                    <View>
                        <TextTitle3 label={"Deskripsi Toko"} />
                        <View className='mt-1'>
                            <TextTitle5 label={bakeryDetail?.bakeryDescription as string} />
                        </View>
                    </View>

                    <View>
                        <TextTitle5Bold label={"Jam Operasional:"} />
                        <View className="mt-1">
                            <TextTitle5 label={`${bakeryDetail?.openingTime} - ${bakeryDetail?.closingTime}`} />
                        </View>
                    </View>

                    <View className="h-px bg-black my-4" />

                    <View>
                        <TextTitle3 label={"Produk Bakeri"} />
                    </View>

                    <View 
                        style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}
                        className='mt-3'
                    >
                        {bakeryDetail?.product.map((product) => (
                            <View
                                key={product.productId}
                                style={{
                                    width: '50%',
                                    marginBottom: 10,
                                }}
                            >
                                <ProductCardBakery
                                    product={product}
                                    onPress={() => 
                                        router.push({
                                            pathname: '/order/orderPage',
                                            params: {
                                                productId: product.productId
                                            }
                                        })
                                    }
                                />
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>

            {/* Display Cart Button if there are items in the orderData */}
            {orderData.length > 0 && (
                <View className="p-5">
                <CustomClickableButton
                    label={`Lihat Keranjang (${orderData.length} item) - Rp. ${totalPrice.toLocaleString('id-ID')}`}
                    handlePress={() => {
                        router.push('/order/orderDetail');
                    }}
                    buttonStyles="bg-orange"
                    isLoading={false} // Add this line
                    icon="map" // Add this line
                />
                </View>
            )}
        </SafeAreaView>
    )
}

export default BakeryDetail