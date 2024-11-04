import React, { useState, useRef, useEffect } from 'react'
import { View, Text, Image, FlatList, TouchableOpacityBase, Animated } from 'react-native'
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
import { useLocalSearchParams } from 'expo-router';
import { ProductType } from '@/types/types';
import AddOrderProductButton from '@/components/AddOrderProductButton';

type BakeryOrderType = {
    bakeryName: string;
    closingTime: string;
}
const OrderPage = () => {

  const { productId } = useLocalSearchParams();

  const [product, setProduct] = useState<ProductType | null>(null);

  const [bakery, setBakery] = useState<BakeryOrderType | null>(null);

  const handleGetProductByIdApi = async () => {
    try {
      const response = await productApi().getProductById({
        productId: parseInt(productId as string),
      })
      if (response.status === 200) {
        setProduct(response.data ? response.data : {})
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetBakeryByProductApi = async () => {
    try {
      const response = await productApi().getBakeryByProduct({
        productId: parseInt(productId as string),
      })

      
      console.log("Hello", response)
      if (response.status === 200) {
        setBakery(response.data ? response.data?.bakery : {})
      }
    } catch (error) {
      console.log(error)
    }
  }

  // const handleGetProductByIdApi = async () => {
  //   try {
  //     const response = await productApi().getBakeryByProduct({
  //       productId: parseInt(productId as string),
  //     })

  //     if (response.status === 200) {
  //       setProduct(response.data ? response.data : {})
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const [form, setForm] = useState({
    productId: 0,
    productQuantity: 0,
  })
  
  useEffect(() => {
    handleGetProductByIdApi()
  }, [productId])

  useEffect(() => {
    handleGetBakeryByProductApi()
  }, [productId])

  const totalAmount = product?.productPrice ? product.productPrice * form.productQuantity : 0;

  return (
    <View>
        <Image 
            source={product?.productImage}
            style={{ width: 375, height: 330, marginBottom: 16 }}
        />
        <View className="mx-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="pr-3 pb-1">
                <TextTitle1 label={product?.productName} />
              </View>
              <CustomTag count={product?.productStock} />
            </View>
          </View>

          <View className="pb-1">
            <TextFormLabel label={bakery?.bakeryName || 'loading'} />
          </View>


          <View className="flex-row items-center">
            <View className='pr-1'>
              {/* <Image 
                  source={require('../../assets/images/starFillIcon.png')}
                  style={{ width: 12, height: 12 }}
              /> */}
            </View>
            {/* <View className='pr-1 pt-1'>
              <TextRating label={"4.2"} />
            </View>
            <View className='pt-1'>
              <TextTitle5 label={"(20 ulasan)"} />
            </View> */}
          </View>
          
          <View className='flex-row items-center'>
            <TextTitle5 label={"Jam Pengambilan Terakhir: "}></TextTitle5>
            <TextOrangeBold label={bakery?.closingTime} />
          </View>

          <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginVertical: 16 }} />

          <View className='h-14'>
            <TextTitle5 label={product?.productDescription} />
          </View>


          <View className="flex-row items-center mt-8">
            <View className="pr-2">
              <Text style={{ fontFamily: 'poppins', textDecorationLine: 'line-through', fontSize: 16 }}>
                {"Rp. " + product?.productPrice + "/pcs"}
              </Text>
            </View>
            <View className='flex-row items-center'>
              <View className='pr-[5px]'>
                {/* <Image 
                    source={require('../../assets/images/discountIcon.png')}
                    style={{ width: 12, height: 12 }}
                /> */}
              </View>
              <TextOrangeBold label={"50% off"} />
            </View>
          </View>

          <View className="pt-2">
            <Text style={{ fontFamily: "poppinsSemiBold", fontSize: 20 }}
              className='text-black'>Rp. 10.000/pcs</Text>
          </View>


          <View className="flex-row items-center justify-between mt-5 mb-5">
            <TextTitle3 label={"Jumlah Pembelian"} />

            <StockInput 
              value={form.productQuantity}
              onChangeText={(text) => 
                setForm({ ...form, productQuantity: parseInt(text) || 1})
              }
            />
          </View>

          <AddOrderProductButton 
            label={`Rp. ${totalAmount.toLocaleString('id-ID')}`}         
            handlePress={() => {}}
            isLoading={false} />
        </View>
    </View>
  )
}

export default OrderPage