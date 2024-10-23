import React, { useState, useRef } from 'react'
import { View, Text, Image, FlatList, TouchableOpacityBase, Animated, TouchableOpacity } from 'react-native'
import { Stack, HStack, VStack } from 'react-native-flex-layout';
import productApi from '@/api/productApi';

import CustomTag from '@/components/CustomTag';
import TextTitle1 from '@/components/texts/TextTitle1';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextRating from '@/components/texts/TextRating';
import TextFormLabel from '@/components/texts/TextFormLabel';
import TextOrangeBold from '@/components/texts/TextOrangeBold';
import TextTitle3 from '@/components/texts/TextTitle3';
import CustomButton from '@/components/CustomButton';
import StockInput from '@/components/StockInput';
import CustomOrderButton from '@/components/CustomOrderButton';
import CustomClickableButton from '@/components/CustomClickableButton';
import { useNavigation } from '@react-navigation/native'; 
import * as SecureStore from "expo-secure-store";

const OrderPage = () => {
  const navigation = useNavigation();
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  // const getProduct = async() => {
  //   const response = await productApi().getProductById({
  //     productId: 1,
  //   });
  // }

  const productPrice = 20000;

  const [form, setForm] = useState({
    userId: 0,
    orderTotalPrice: 0,
    orderDetail: [
      {
        productId: 0,
        productQuantity: 2, // Initialize with a default value
        productTotalPrice: productPrice * 2,
      },
    ],
  });

  const calculateTotalPrice = (quantity: number) => quantity * productPrice;

  const handleStockChange = (quantity: string) => {
    const updatedQuantity = parseInt(quantity) || 1; // Fallback to 1 if NaN
    const updatedTotalPrice = calculateTotalPrice(updatedQuantity);

    setForm((prevForm) => ({
      ...prevForm,
      orderDetail: [
        {
          ...prevForm.orderDetail[0],
          productQuantity: updatedQuantity,
          productTotalPrice: updatedTotalPrice,
        },
      ],
    }));
  };

  const { productQuantity, productTotalPrice } = form.orderDetail[0];

  return (
    <View>
      <View style={{ position: 'relative' }}>
        <Image
          source={require('../../assets/images/produk1.png')}
          style={{ width: '100%', height: 310 }}
        />

        {/* Back Button Positioned Absolutely */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 55,
            left: 20,
            backgroundColor: 'white',
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>
            {'<'}
          </Text>
        </TouchableOpacity>
      </View>


        <View className="mx-5 mt-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="pr-3">
                <TextTitle1 label={"Roti Unyil"} />
              </View>
              <CustomTag count={2} />
            </View>
            <View>
              <CustomClickableButton label={"500 m"} handlePress={() => {}} buttonStyles={"bg-brown"} isLoading={false} icon="map" />
            </View>
          </View>

          <TextFormLabel label={"Berkat Bakery"} />

          <View className="flex-row items-center">
            <View className='pr-1'>
              <Image 
                  source={require('../../assets/images/starFillIcon.png')}
                  style={{ width: 12, height: 12 }}
              />
            </View>
            <View className='pr-1 pt-1'>
              <TextRating label={"4.2"} />
            </View>
            <View className='pt-1'>
              <TextTitle5 label={"(20 ulasan)"} />
            </View>
          </View>
          
          <View className='flex-row items-center'>
            <Text>Jam Pengambilan Terakhir: </Text>
            <TextOrangeBold label={"21.00"} />
          </View>

          <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginVertical: 16 }} />

          <TextTitle5 label={"Classic Black Forest with a combination of chocolate cream and rich black cherry pieces, topped with cherries and sprinkled with chocolate shavings."} />

          <View className="flex-row items-center pt-3 pb-1">
            <View className="pr-2">
              <Text style={{ textDecorationLine: 'line-through', fontSize: 12 }}>
                Rp 20.000/pcs
              </Text>
            </View>
            <View className='flex-row items-center pt-1'>
              <View className='pr-[5px]'>
                <Image 
                    source={require('../../assets/images/discountIcon.png')}
                    style={{ width: 12, height: 12 }}
                />
              </View>
              <TextOrangeBold label={"50% off"} />
            </View>
          </View>

          <View>
            <Text style={{ fontFamily: "poppinsSemiBold", fontSize: 18 }} className='text-black'>Rp 10.000/pcs </Text>
          </View>

          <View className="flex-row items-center justify-between mt-2 mb-5">
            <TextTitle3 label={"Jumlah Pembelian"} />
            <StockInput
              value={productQuantity} // Convert to string for input
              onChangeText={handleStockChange}
            />
          </View>

          <View>
            <CustomOrderButton
              label="Tambahkan Pesanan • "
              price={60000} // Pass total price as prop
              handlePress={() => {
                console.log('Order submitted:', form);
              }}
              buttonStyles="w-full"
              isLoading={false}
            />
          </View>
        </View>



    </View>
  )
}

export default OrderPage