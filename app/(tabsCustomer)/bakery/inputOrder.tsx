import React, { useState, useRef, useEffect, useCallback } from 'react'
import { View, Text, Image, FlatList, TouchableOpacityBase, Animated, TouchableOpacity } from 'react-native'
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
import { useFocusEffect, useLocalSearchParams, router } from 'expo-router';
import { BakeryType, ProductType } from '@/types/types';
import AddOrderProductButton from '@/components/AddOrderProductButton';
import BackButton from '@/components/BackButton';
import CircleBackButton from '@/components/CircleBackButton';
import { getLocalStorage, removeLocalStorage, updateLocalStorage, calculateTotalOrderPrice, formatRupiah } from '@/utils/commonFunctions';
import { Route } from 'expo-router/build/Route';
import { images } from '@/constants/images';
import { FontAwesome } from '@expo/vector-icons';
import TextTitle4 from '@/components/texts/TextTitle4';
import TextTitle5Bold from '@/components/texts/TextTitle5Bold';
import TextBeforePrice from '@/components/texts/TextBeforePrice';
import TextDiscount from '@/components/texts/TextDiscount';
import TextAfterPrice from '@/components/texts/TextAfterPrice';
import ModalAction from '@/components/ModalAction';

type BakeryDetailType = {
  bakery: {
    bakeryId: number;
    bakeryName: string;
    closingTime: string;
  },
  prevRating: {
    averageRating: string;
    reviewCount: string;
  }
}

const InputOrder = () => {

  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [bakery, setBakery] = useState<BakeryDetailType | null>(null);
  const emptyForm = {
    productId: parseInt(productId as string),
    productQuantity: 0,
  }
  const [form, setForm] = useState(emptyForm);
  const [totalPrice, setTotalPrice] = useState(0);
  const [changeOrderModal, setChangeOrderModal] = useState(false);

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
      if (response.status === 200) {
        setBakery(response.data ? response.data : {})
      }
    } catch (error) {
      console.log(error)
    }
  }

  const loadProductQuantity = async () => {
    try {
      const jsonValue = await getLocalStorage('orderData');
      if (jsonValue !== null && jsonValue !== undefined) {
        const existingOrders = JSON.parse(jsonValue);
        const existingProduct = existingOrders.items.find(
          (item: { productId: number }) => item.productId === parseInt(productId as string)
        );

        if (existingProduct) {
          setForm({ ...form, productQuantity: existingProduct.productQuantity });
          handleCalculateTotalPrice(existingProduct.productQuantity);
        }
      } else {
        console.log('No order data found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateOrderData = (
    currentOrder: { productId: number; productQuantity: number }[],
    newOrder: { productId: number; productQuantity: number }
  ) => {
    const index = currentOrder.findIndex(item => item.productId === newOrder.productId);

    if (index !== -1) {
      currentOrder[index].productQuantity = newOrder.productQuantity; // Update quantity
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
          bakeryId: bakery?.bakery.bakeryId, // Assuming bakeryId comes from bakery object
          items: [form]
        };

        // Save the new order with bakeryId
        await AsyncStorage.setItem('orderData', JSON.stringify(newOrder));
      } else {
        // If an order exists, check if bakeryId matches
        const currentBakeryId = orderData.bakeryId;

        if (currentBakeryId !== bakery?.bakery.bakeryId) {
          setChangeOrderModal(true);
          return;
        } else {
          // If bakeryId matches, update the order items
          const updatedItems = updateOrderData(orderData.items, {
            productId: parseInt(productId as string),
            productQuantity: form.productQuantity
          });

          // Save the updated data with the same bakeryId
          await AsyncStorage.setItem('orderData', JSON.stringify({ bakeryId: currentBakeryId, items: updatedItems }));
        }
      }

      router.push({
        pathname: '/bakery/bakeryDetail' as any,
        params: { bakeryId: bakery?.bakery.bakeryId },
      })
    } catch (error) {
      console.log('Error handling the order:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetProductByIdApi()
      handleGetBakeryByProductApi()
      loadProductQuantity()
    }, [])
  )

  const handleCalculateTotalPrice = (productQuantity: number) => {
    const total = product?.todayPrice as number * productQuantity;
    setTotalPrice(total);
  }

  return (
    <View>
      <View>
        <Image
          source={images.logo}
          style={{ width: '100%', height: 280 }}
        />
        <View style={{ position: 'absolute', top: 60, left: 30 }}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            style={{
              backgroundColor: "white",
              borderRadius: 25,
              padding: 8,
            }}
            className='w-9 h-9 justify-center items-center'
          >
            <FontAwesome name="angle-left" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mx-5 mt-3">
        <View className="flex-row items-center">
          <View className='mr-3'>
            <TextTitle1 label={product?.productName as string} />
          </View>
          <CustomTag count={product?.productStock as number} />
        </View>

        <TextTitle4 label={bakery?.bakery.bakeryName as string} />

        <TextRating
          rating={bakery?.prevRating.averageRating as string}
          reviewCount={bakery?.prevRating.reviewCount as string}
        />

        <View className='flex-row items-center'>
          <TextTitle5 label={"Jam Pengambilan Terakhir: "}></TextTitle5>
          <TextTitle5Bold label={bakery?.bakery.closingTime as string} color='#FA6F33' />
        </View>

        <View className="h-px bg-gray-200 my-4" />

        <View className='h-14'>
          <TextTitle5 label={product?.productDescription as string} />
        </View>

        <View className="mt-5">
          <View className='flex-row'>
            <View className='mr-2'>
              <TextBeforePrice label={formatRupiah(Number(product?.productPrice))} />
            </View>
            <TextDiscount label={product?.discountPercentage as string} />
          </View>
          <TextAfterPrice label={formatRupiah(Number(product?.todayPrice))} size={20} />
        </View>


        <View className="flex-row items-center justify-between mt-5">
          <TextTitle3 label="Jumlah Pembelian" />
          <StockInput
            value={form.productQuantity}
            onChangeText={(text) => {
              setForm({ ...form, productQuantity: parseInt(text) });
              handleCalculateTotalPrice(parseInt(text));
            }}
          />
        </View>

        <View className='my-5'>
          <AddOrderProductButton
            label={formatRupiah(totalPrice)}
            handlePress={handleAddOrder}
            isLoading={false}
          />
        </View>
      </View>

      <ModalAction
        setModalVisible={setChangeOrderModal}
        modalVisible={changeOrderModal}
        title='Ingin membeli dari bakeri lain?'
        primaryButtonLabel='Iya'
        secondaryButtonLabel='Tidak'
        onPrimaryAction={() => {}}
        onSecondaryAction={() => setChangeOrderModal(false)}
      />
    </View >

  )
}

export default InputOrder