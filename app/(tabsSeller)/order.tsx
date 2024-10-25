import { View, Text, Image, Button, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import UploadButton from '@/components/UploadButton';
import { Picker } from '@react-native-picker/picker';
import TextHeader from '@/components/texts/TextHeader';
import OrderStatusTab from '@/components/OrderStatusTab';
import orderSellerApi from '@/api/orderSellerApi';
import SellerOrderCardPending from '@/components/SellerOrderCardPending';
import SellerOrderCard from '@/components/SellerOrderCard';
import { router, useFocusEffect } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


type Order = {
  orderId: number;
  orderStatus: number;
  userId: number;
  bakeryId: number;
  orderDate: string;
  user: User;
  orderDetail: OrderDetail[];
};

type User = {
  email: string;
  password: string;
  regionId: number;
  roleId: number;
  signUpDate: string;
  userId: number;
  userImage: string | null;
  userName: string;
  userPhoneNumber: string;
};

type OrderDetail = {
  orderDetailId: number;
  orderId: number;
  productId: number;
  productQuantity: number;
  product: Product;
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
};

interface OrderDetailProps {
  navigation: StackNavigationProp<any>;
  route: RouteProp<{ params: { status: any, isFromHomePage: boolean } }>;
}

const Order: React.FC<OrderDetailProps> = ({ navigation, route }) => {

  const { status, isFromHomePage } = route.params || { status: 1, isFromHomePage: false };
  const insets = useSafeAreaInsets();

  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const hasManualSelection = useRef(false);
  const initialHomePage = useRef(true);
  const [order, setOrder] = useState<Order[]>([]);

  const handleSelectStatus = (status: number) => {
    setSelectedStatus(status);
    hasManualSelection.current = true;
  };

  const handleGetAllOrderByStatusApi = useCallback(async () => {
    try {
      const response = await orderSellerApi().getAllOrderByStatus({
        orderStatus: selectedStatus
      });
      if (response.status === 200) {
        setOrder(response.data || null);
      }
    } catch (error) {
      console.log(error);
    }
  }, [selectedStatus]);

  useFocusEffect(
    useCallback(() => {

      if (isFromHomePage && initialHomePage.current) {
        setSelectedStatus(status);
        initialHomePage.current = false;
        hasManualSelection.current = false;
      } else if (!hasManualSelection.current) {
        setSelectedStatus(status);
      }

      return () => {
        initialHomePage.current = true;
      };
    }, [status, isFromHomePage])
  )

  useFocusEffect(
    useCallback(() => {

      handleGetAllOrderByStatusApi();

      return () => {
        setOrder([]);
      };
    }, [handleGetAllOrderByStatusApi])
  );

  const handleActionOrder = async (orderId: number, orderStatus: number) => {
    try {
      const response = await orderSellerApi().actionOrder({
        orderId: orderId,
        orderStatus: orderStatus
      })
      if (response.status === 200) {
        handleGetAllOrderByStatusApi();
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View className='flex-1'>
      <View
        style={{
          backgroundColor: 'white',
          height: insets.top
        }}
      />

      <View className='bg-background h-full flex-1'>
        <View className='bg-white'>
          <View className='mx-5'>
            <TextHeader label="PESANAN" />
            <View className='mt-6'>
              <OrderStatusTab
                selectedStatus={selectedStatus || 1}
                onSelectStatus={handleSelectStatus}
              />
            </View>
          </View>
        </View>

        <View className='flex-1 mx-5 pb-5'>
          <FlatList
            data={order}
            renderItem={({ item }) => (
              item.orderStatus === 1 ? (
                <SellerOrderCardPending
                  order={item}
                  onPress={() => {
                    navigation.navigate('Order',
                      {
                        screen: 'OrderDetail',
                        params: { order: item }
                      }
                    )
                  }}
                  onAccept={() => handleActionOrder(item.orderId, 2)}
                  onReject={() => handleActionOrder(item.orderId, 4)}
                />
              ) : (
                <SellerOrderCard
                  order={item}
                  onPress={() => {
                    navigation.navigate('Order',
                      {
                        screen: 'OrderDetail',
                        params: { order: item }
                      }
                    )
                  }}
                />
              )
            )}
            keyExtractor={(item) => item.orderId.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
};

export default Order;
