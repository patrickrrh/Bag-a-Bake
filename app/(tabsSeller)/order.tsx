import { View, Text, Image, Button, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
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
import { router } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';

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
}


const Order: React.FC<OrderDetailProps> = ({ navigation }) => {

  const [selectedStatus, setSelectedStatus] = useState(1);
  const [order, setOrder] = useState<Order[]>([]);

  const handleSelectStatus = (status: number) => {
    setSelectedStatus(status);
  };

  const handleGetAllOrderByStatusApi = async () => {
    try {
      const response = await orderSellerApi().getAllOrderByStatus({
        orderStatus: selectedStatus
      });
      if (response.status === 200) {
        setOrder(response.data || null);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetAllOrderByStatusApi();
  }, [selectedStatus]);

  console.log("order", order)

  return (
    <SafeAreaView className='bg-background h-full flex-1'>
      <View className='bg-white'>
        <View className='mx-5'>
          <TextHeader label="PESANAN" />
          <View className='mt-6'>
            <OrderStatusTab
              selectedStatus={selectedStatus}
              onSelectStatus={handleSelectStatus}
            />
          </View>
        </View>
      </View>

      <View className='mx-5'>
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
          className='mt-4'
        />
      </View>
    </SafeAreaView>
  );
};

export default Order;
