import React, { useEffect, useState, useCallback } from 'react';
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { FontAwesome } from '@expo/vector-icons';
import { getLocalStorage } from '@/utils/commonFunctions';
import { useFocusEffect } from '@react-navigation/native';
import { calculateTotalOrderPrice } from '@/utils/commonFunctions';
import LargeImage from '@/components/LargeImage';
import { images } from '@/constants/images'
import TextRating from '@/components/texts/TextRating';

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
    bakery: Bakery;
    product: Product[];
    prevRating: {
        averageRating: string;
        reviewCount: string;
    }
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
    items:
    [
        {
            orderQuantity: number;
            productId: number;
        }
    ];
};

const BakeryDetail = () => {

    const insets = useSafeAreaInsets();

    const { productId, bakeryId } = useLocalSearchParams();
    const [bakeryDetail, setBakeryDetail] = useState<Bakery | null>(null);
    const [isSubmitting, setisSubmitting] = useState(false);
    const [totalPrice, setTotalPrice] = useState("");
    const [orderData, setOrderData] = useState<OrderItem | null>(null);

    const [showFavorite, setShowFavorite] = useState(false);

    const fetchOrderData = async () => {
        try {
            const jsonValue = await getLocalStorage('orderData');
            const data: OrderItem = jsonValue ? JSON.parse(jsonValue) : null;
            console.log("INIII APAAA", data)
            setOrderData(data);

            // Calculate Total Order Price
            const products = bakeryDetail?.product || [];

            const mappedOrderDetail = data?.items.map((item: any) => {
                const product = products.find(prod => prod.productId === item.productId);
                return {
                    product: product || {},
                    productQuantity: item.orderQuantity
                };
            }) || [];

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
            if (response.status === 200) {
                setBakeryDetail(response.data ? response.data : {})
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleBakeryChangeAlert = async () => {
        const jsonValue = await AsyncStorage.getItem('orderData');
        const data = jsonValue ? JSON.parse(jsonValue) : [];

        // If there are items from a different bakery, show the alert
        if (data.length > 0 && !bakeryDetail?.product.some(product => data.some((order: { productId: number; }) => order.productId === product.productId))) {
            Alert.alert(
                "Switch Bakery",
                "Adding products from this bakery will clear items from the previous bakery. Proceed?",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Proceed",
                        onPress: async () => {
                            await AsyncStorage.removeItem('orderData');
                            fetchOrderData();
                        },
                    },
                ]
            );
        }
    };

    useEffect(() => {
        handleGetBakeryByIdApi();
        handleBakeryChangeAlert();
    }, [bakeryId]);

    useFocusEffect(
        useCallback(() => {
            fetchOrderData();
        }, [])
    );

    console.log("bakery detail", JSON.stringify(bakeryDetail, null, 2));

    return (
        <View className="flex-1 bg-background">

            <View style={{ height: insets.top }} />

            <ScrollView className="px-5">
                <View className="flex-row w-full justify-between">
                    <BackButton />
                    <TextTitle3 label={bakeryDetail?.bakery.bakeryName as string} />
                    {/* TO DO: Toggle Favorite */}
                    <TouchableOpacity
                        onPress={() => {
                            setShowFavorite(!showFavorite);
                        }}
                    >
                        {
                            showFavorite ? (
                                <Ionicons
                                    name="heart"
                                    size={24}
                                    color="red"
                                />
                            ) : (
                                <Ionicons
                                    name="heart-outline"
                                    size={24}
                                    color="black"
                                />
                            )
                        }
                    </TouchableOpacity>
                </View>

                <View className='mt-5 rounded-lg'>
                    <LargeImage
                        image={images.logo}
                    />
                </View>

                <View className="mt-5">
                    <View className='flex-row justify-between items-start'>
                        <View>
                            <View className='flex-row'>
                                <FontAwesome6 name='location-dot' size={14} />
                                <TextTitle5 label={bakeryDetail?.bakery?.regionBakery?.regionName as string} containerStyle={{ marginLeft: 5 }} />
                            </View>
                            <TextRating
                                rating={bakeryDetail?.prevRating.averageRating || "0"}
                                reviewCount={bakeryDetail?.prevRating.reviewCount || "0"}
                            />
                        </View>

                        <View>
                            <CustomClickableButton
                                label={"Hubungi Bakeri"}
                                handlePress={() => { }}
                                isLoading={isSubmitting}
                                icon="whatsapp"
                                iconColor='#25D366'
                            />
                        </View>
                    </View>

                    <View className='mt-3'>
                        <TextTitle3 label={"Deskripsi Toko"} />
                        <TextTitle5 label={bakeryDetail?.bakery.bakeryDescription as string} />
                    </View>

                    <View className='mt-3'>
                        <TextTitle5Bold label={"Jam Operasional:"} />
                        <TextTitle5 label={`${bakeryDetail?.bakery.openingTime} - ${bakeryDetail?.bakery.closingTime}`} />
                    </View>

                    <View className="h-px bg-gray-200 my-4" />

                    <View>
                        <TextTitle3 label={"Produk Bakeri"} />
                    </View>

                    <View
                        style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}
                        className='mt-3'
                    >
                        {bakeryDetail?.bakery?.product.map((product) => (
                            <View
                                key={product.productId}
                                className='pb-5 w-[50%]'
                            >
                                <ProductCardBakery
                                    product={product}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/bakery/inputOrder',
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
            {orderData && (
                <View className="p-5">
                    <CustomClickableButton
                        label={`Lihat Keranjang (${orderData.items.length} item) - Rp. ${totalPrice}`}
                        handlePress={() => {
                            router.push('/order/orderDetail');
                        }}
                        buttonStyles="bg-orange"
                        isLoading={false} // Add this line
                        icon="map" // Add this line
                    />
                </View>
            )}
        </View>
    )
}

export default BakeryDetail