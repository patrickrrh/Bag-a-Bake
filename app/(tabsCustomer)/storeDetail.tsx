import OrderStatusTab from '@/components/OrderStatusTab';
import SearchBar from '@/components/SearchBar';
import TextHeader from '@/components/texts/TextHeader'
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextRating from '@/components/texts/TextRating';
import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Button, ImageSourcePropType, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import TextTitle4 from '@/components/texts/TextTitle4';
import TextTitle5Date from '@/components/texts/TextTitle5Date';
import BackButton from '@/components/BackButton';
import { Ionicons } from "@expo/vector-icons";
import CustomClickableButton from '@/components/CustomClickableButton';
import { icons } from "@/constants/icons";
import ProductCard from '@/components/ProductCard';

const StoreDetail = () => {

    const [favorites, setFavorites] = useState<number[]>([]);

    const store = {
        id: 1,
        name: "Berkat Bakery",
        location: "Pacific Garden, Alam Sutera",
        rating: 4.2,
        reviews: 20,
        distance: 3,
        operatingHours: {
            weekdays: "07.00 - 20.00",
            weekend: "08.00 - 18.00",
        },
        products: [
            {
                id: 1,
                name: "Roti Unyil",
                image: "../assets/images/rotiUnyil.png",
                rating: 4.5,
                reviews: 15,
                price: 8000,
                currency: "IDR"
            },
            {
                id: 2,
                name: "Croissant",
                image: "../assets/images/croissant.png",
                rating: 4.3,
                reviews: 10,
                price: 12000,
                currency: "IDR"
            },
            // Add more products as needed
        ]
    };

    const toggleFavorite = () => {
        if (favorites.includes(store.id)) { 
            setFavorites(favorites.filter((id) => id !== store.id));
        } else {
            setFavorites([...favorites, store.id]);
        }
    };

    return (
        <SafeAreaView className="bg-background h-full flex-1">
            <View className="flex-row mx-5 pb-2">
                <BackButton />
                <View className="flex-1 items-center pr-3">
                    <TextTitle3 label="Roti Unyil" />
                </View>
                <TouchableOpacity onPress={toggleFavorite} className="flex-2 items-center">
                    <Ionicons name={favorites.includes(store.id) ? "heart" : "heart-outline"} 
                    size={24}
                    color={favorites.includes(store.id) ? "red" : "black"}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView className="mx-5">
                <Image 
                    source={require('../../assets/images/bakery.png')}
                    style={{ width: 353, height: 177, marginTop: 20, borderRadius: 10 }}
                />

                <View className="pt-5">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <View className='pr-1'>
                            <Image 
                                    source={require('../../assets/images/starFillIcon.png')}
                                    style={{ width: 12, height: 12 }}
                                />
                            </View>
                            <View className='pr-1 pt-1'>
                                <TextRating label={"4.5"} />
                            </View>
                            <View className='pt-1'>
                                <TextTitle5 label={"(20 ulasan)"} />
                            </View>
                        </View>
                        <View>
                            <CustomClickableButton label={"Buka Toko"} handlePress={() => {}} buttonStyles={"bg-brown"} isLoading={false} icon="map" />
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <View className="pr-1">
                            <Image
                                source={require("../../assets/images/locationIcon.png")}
                                style={{ width: 12, height: 12 }}
                            />
                        </View>
                        <View className="pr-1 pt-1">
                            <TextTitle5 label={store.location} />
                        </View>
                    </View>

                    <View className="pr-56 pt-2">
                        <CustomClickableButton label={"Hubungi Bakeri"} handlePress={() => {}} buttonStyles={"bg-brown"} isLoading={false} icon="whatsapp" />        
                    </View>

                    <View className="pt-2">
                        <TextTitle3 label={"Deskripsi Produk"} />
                    </View>
                    
                    <View className="pb-3">
                        <Text>Jam Operasional:</Text>
                        <View className="pt-1">
                            <Text>• Senin - Jumat: {store.operatingHours.weekdays}</Text>
                            <Text>• Sabtu - Minggu: {store.operatingHours.weekend}</Text>
                        </View>
                    </View>

                    <View style={{ height: 1, backgroundColor: '#331612', marginVertical: 10 }} />

                    <View className="pt-1 pb-2">
                        <TextTitle3 label={"Produk Bakeri"} />
                    </View>

                    <FlatList
                        data={store.products}
                        renderItem={({ item }) => <ProductCard product={item} />}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        scrollEnabled={false}
                        columnWrapperStyle={{ justifyContent: 'space-between' }} // Style for column layout
                    />
                </View>
                
            </ScrollView>
        </SafeAreaView>
    )
}

export default StoreDetail