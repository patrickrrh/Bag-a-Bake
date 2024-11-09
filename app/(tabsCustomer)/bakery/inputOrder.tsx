import React, { useState, useRef, useEffect, useCallback } from 'react'
import { View, Text, Image, FlatList, TouchableOpacityBase, Animated } from 'react-native'
import { Stack, HStack, VStack } from 'react-native-flex-layout';
import productApi from '@/api/productApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomTag from '@/components/CustomTag';
import TextTitle1 from '@/components/texts/TextTitle1';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextRating from '@/components/texts/TextRating';
import TextFormLabel from '@/components/texts/TextFormLabel';
import TextOrangeBold from '@/components/texts/TextOrangeBold';
import TextTitle3 from '@/components/texts/TextTitle3';
import CustomButton from '@/components/CustomButton';
import StockInput from '@/components/StockInput';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { BakeryType, ProductType } from '@/types/types';
import AddOrderProductButton from '@/components/AddOrderProductButton';
import BackButton from '@/components/BackButton';
import CircleBackButton from '@/components/CircleBackButton';
import { getLocalStorage, removeLocalStorage, updateLocalStorage } from '@/utils/commonFunctions';

const InputOrder = () => {

  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [bakery, setBakery] = useState<BakeryType | null>(null);
  const emptyForm = {
    productId: parseInt(productId as string),
    orderQuantity: 0,
  }
  const [form, setForm] = useState(emptyForm);

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

  const loadProductQuantity = async () => {
    try {
      const jsonValue = await getLocalStorage('orderData');
      console.log("son value", jsonValue)
      if (jsonValue !== null && jsonValue !== undefined) {
        const existingOrders = JSON.parse(jsonValue);
        const existingProduct = existingOrders.items.find(
          (item: { productId: number }) => item.productId === parseInt(productId as string)
        );

        if (existingProduct) {
          console.log("masuk sini gak")
          setForm({ ...form, orderQuantity: existingProduct.orderQuantity });
        }
      } else {
        // Handle the case where jsonValue is null or undefined
        console.log('No order data found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateOrderData = (
    currentOrder: { productId: number; orderQuantity: number }[], 
    newOrder: { productId: number; orderQuantity: number }
  ) => {
    const index = currentOrder.findIndex(item => item.productId === newOrder.productId);
  
    if (index !== -1) {
      currentOrder[index].orderQuantity = newOrder.orderQuantity; // Update quantity
    } else {
      currentOrder.push(newOrder); // Add new product
    }
  
    return currentOrder;
  };

  const handleAddOrder = async () => {
    try {
      // Retrieve the current order data from AsyncStorage
      const jsonValue = await AsyncStorage.getItem('orderData');
      const orderData = jsonValue ? JSON.parse(jsonValue) : [];
  
      // Check if no order exists
      if (orderData.length === 0) {
        // Insert the bakeryId outside the array if no order data exists
        const newOrder = {
          bakeryId: bakery?.bakeryId, // Assuming bakeryId comes from bakery object
          items: [form]
        };
  
        // Save the new order with bakeryId
        await AsyncStorage.setItem('orderData', JSON.stringify(newOrder));
        console.log('New order created with bakeryId:', bakery?.bakeryId);
      } else {
        // If an order exists, check if bakeryId matches
        const currentBakeryId = orderData.bakeryId;
  
        if (currentBakeryId !== bakery?.bakeryId) {
          console.log('Bakery ID does not match! Handle error or switch bakery');
        } else {
          // If bakeryId matches, update the order items
          const updatedItems = updateOrderData(orderData.items, {
            productId: parseInt(productId as string),
            orderQuantity: form.orderQuantity
          });
  
          // Save the updated data with the same bakeryId
          await AsyncStorage.setItem('orderData', JSON.stringify({ bakeryId: currentBakeryId, items: updatedItems }));
        }
      }
    } catch (error) {
      console.log('Error handling the order:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      removeLocalStorage('orderData')
      handleGetProductByIdApi()
      handleGetBakeryByProductApi()
      loadProductQuantity()
    }, [])
  )

  console.log("bakery", bakery)

  // const totalAmount = product?.productPrice ? product.productPrice * form.productQuantity : 0;

  return (
    <View>
        <View>
          <Image
            source={product?.productImage}
            style={{ width: '100%', height: 330 }}
          />
          <View style={{ position: 'absolute', top: 70, left: 28 }}>
            <CircleBackButton />
          </View>
        </View>

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
              value={form.orderQuantity}
              onChangeText={(text) => 
                setForm({ ...form, orderQuantity: parseInt(text) || 1})
              }
            />
          </View>

          <AddOrderProductButton 
            // label={`Rp. ${totalAmount.toLocaleString('id-ID')}`}         
            label='1'
            handlePress={handleAddOrder}
            isLoading={false} />
        </View>
    </View>
  )
}

export default InputOrder