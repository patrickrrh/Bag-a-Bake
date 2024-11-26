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
    Linking,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
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
import { convertPhoneNumberFormat, formatRupiah, getLocalStorage, removeLocalStorage } from '@/utils/commonFunctions';
import { calculateTotalOrderPrice } from '@/utils/commonFunctions';
import LargeImage from '@/components/LargeImage';
import { images } from '@/constants/images'
import TextRating from '@/components/texts/TextRating';
import OpenCartButton from '@/components/OpenCartButton';
import TextEllipsis from '@/components/TextEllipsis';
import { icons } from "@/constants/icons";

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
    product: Product[];
    prevRating: {
        averageRating: string;
        reviewCount: string;
    }
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
            productQuantity: number;
            productId: number;
        }
    ];
};

const BakeryDetail = () => {

    const insets = useSafeAreaInsets();

    const { bakeryId } = useLocalSearchParams();
    const [bakeryDetail, setBakeryDetail] = useState<Bakery | null>(null);
    const [isSubmitting, setisSubmitting] = useState(false);
    const [totalPrice, setTotalPrice] = useState("");
    const [orderData, setOrderData] = useState<OrderItem | null>(null);

    const [showFavorite, setShowFavorite] = useState(false);

    const fetchOrderData = async () => {
        try {
            const jsonValue = await getLocalStorage('orderData');
            const data: OrderItem = jsonValue ? JSON.parse(jsonValue) : null;
            setOrderData(data);

            console.log("Data: ", orderData);

            const mappedOrderDetail = data?.items.map((item: any) => {
                const product = bakeryDetail?.bakery.product.find(prod => prod.productId === item.productId);
                return {
                    product: product || {},
                    productQuantity: item.productQuantity
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

    const handleGetBakeryByIdApi = async () => {
        try {
            const response = await bakeryApi().getBakeryById({
                bakeryId: parseInt(bakeryId as string),
            })

            if (response.status === 200) {
                setBakeryDetail(response.data ? response.data : {});
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (bakeryDetail) {
            fetchOrderData();
        }
    }, [bakeryDetail]);

    useFocusEffect(
        useCallback(() => {
            handleGetBakeryByIdApi();
        }, [bakeryId])
    );

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

    return (
        <View className="flex-1 bg-background">

            <View style={{ height: insets.top }} />

            <View className="flex-row px-5 mb-5 w-full justify-between">
                <BackButton path='/(tabsCustomer)/bakery' />
                <TextTitle3 label={bakeryDetail?.bakery.bakeryName as string} />
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

            <ScrollView className="px-5">

                <View className='rounded-lg'>
                    <LargeImage
                        image={{ uri: bakeryDetail?.bakery.bakeryImage as string }}
                    />
                </View>

                <View className="mt-5">
                    <View className='flex-row justify-between items-start w-full'>
                        <View className='w-1/2'>
                            <View className='flex-row mb-2'>
                                <Ionicons name="location-sharp" size={14} style={{ marginRight: 5 }} />
                                <View>
                                    <TextTitle5 label={bakeryDetail?.bakery?.bakeryAddress as string} />
                                </View>
                            </View>
                            <TextRating
                                rating={bakeryDetail?.prevRating.averageRating || "0"}
                                reviewCount={bakeryDetail?.prevRating.reviewCount || "0"}
                            />
                        </View>

                        <View>
                            <CustomClickableButton
                                label={"Hubungi Bakeri"}
                                handlePress={() => handleContactSeller(bakeryDetail?.bakery.bakeryPhoneNumber as string)}
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

                    {
                        bakeryDetail?.bakery?.product.length !== 0 ? (
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
                        ) : (
                            <View className="flex-1 items-center justify-center mt-5">
                                <Image
                                    source={icons.bakeBread}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        marginBottom: 10,
                                        tintColor: "#828282",
                                    }}
                                    resizeMode="contain"
                                />
                                <Text
                                    style={{
                                        color: "#828282",
                                        fontFamily: "poppinsRegular",
                                        fontSize: 14,
                                        textAlign: "center",
                                        marginInline: 40
                                    }}
                                >
                                    Bakeri ini sedang tidak menjual produk, silakan coba lagi nanti
                                </Text>
                            </View>
                        )
                    }


                </View>

            </ScrollView>

            {(orderData && orderData.bakeryId == bakeryDetail?.bakery.bakeryId) && (
                <View className="w-full flex justify-end p-5">
                    <OpenCartButton
                        label={`Lihat Keranjang (${orderData.items.length} item)  •  ${totalPrice}`}
                        handlePress={() => {
                            router.push({
                                pathname: '/order/inputOrderDetail' as any,
                                params: {
                                    bakeryId: bakeryId
                                }
                            })
                        }}
                        isLoading={isSubmitting}
                        icon="bag-outline"
                        iconColor='white'
                    />
                </View>
            )}
        </View>
    )
}

export default BakeryDetail