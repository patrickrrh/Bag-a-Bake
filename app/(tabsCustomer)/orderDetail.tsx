import BackButton from '@/components/BackButton';
import CustomButton from '@/components/CustomButton';
import TextOrangeBold from '@/components/texts/TextOrangeBold';
import TextTitle3 from '@/components/texts/TextTitle3';
import TextTitle4 from '@/components/texts/TextTitle4';
import TextTitle5Bold from '@/components/texts/TextTitle5Bold';
import React from 'react'
import { View, Text, Image, FlatList, TouchableOpacityBase, Animated } from 'react-native'
import { Stack, HStack, VStack } from 'react-native-flex-layout';
import { SafeAreaView } from 'react-native-safe-area-context';
const OrderDetail = () => {

    const foodItems = [
        { id: 1, name: "Nama Makanan 1", price: 40000, quantity : 1 },
        { id: 2, name: "Nama Makanan 2", price: 30000, quantity : 2 },
        { id: 3, name: "Nama Makanan 3", price: 50000, quantity: 3},
    ];

    const totalPrice = foodItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString('id-ID');

    return (
        <SafeAreaView className="bg-background h-full flex-1">
            <View className="mx-5">
                <View className="flex-row">
                    <BackButton />
                    <View className="flex-1 items-center pr-3">
                        <TextTitle3 label="10 Juni 2024 15:39" />
                    </View>
                </View>

                <Image 
                    source={require('../../assets/images/map.png')}
                    style={{ width: 353, height: 177, marginTop: 40 }}
                />
            </View>
            <View className="flex-row mt-10 bg-white">
                <Image 
                    source={require('../../assets/images/profile.jpg')}
                style={{ width: 40, height: 40, borderRadius: 48, marginTop: 8, marginBottom: 8, marginLeft: 20 }}
                />

                <View className="ml-4 my-2">
                    <TextTitle4 label="Berkat Bakery" />
                    <View className="flex-row mt-1">
                        <Text>Jam Pengambilan Terakhir: </Text> 
                        <TextOrangeBold label="21.00" />
                    </View>
                </View>
            </View>

            <View className="mt-4 bg-white">
                <View className="mx-5 my-3">
                    <TextTitle4 label="Ringkasan Pesanan" />
                    {foodItems.map((item) => (
                        <View key={item.id} className="flex-row justify-between mt-4">
                            <View className="flex-row">
                                <View className="mr-4">
                                    <TextTitle5Bold label={`${item.quantity}x`} />
                                </View>
                                <Text>{item.name}</Text>
                            </View>
                            <Text>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</Text>
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
                <CustomButton label="Pesan" handlePress={() => {}} buttonStyles="w-full" isLoading={false} />
            </View>
        </SafeAreaView>

    )
}

export default OrderDetail