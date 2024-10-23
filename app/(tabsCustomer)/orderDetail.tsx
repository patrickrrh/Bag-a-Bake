import BackButton from "@/components/BackButton";
import CustomButton from "@/components/CustomButton";
import TextOrangeBold from "@/components/texts/TextOrangeBold";
import TextTitle3 from "@/components/texts/TextTitle3";
import TextTitle4 from "@/components/texts/TextTitle4";
import TextTitle5Bold from "@/components/texts/TextTitle5Bold";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacityBase,
  Animated,
} from "react-native";
import { Stack, HStack, VStack } from "react-native-flex-layout";
import { SafeAreaView } from "react-native-safe-area-context";
import orderCustomerApi from "@/api/orderCustomerApi";
import { router, useLocalSearchParams } from "expo-router";

type Product = {
    productId: number;
    productName: string;
    productPrice: string;
    productImage: string;
};

type OrderDetailItem = {
    orderDetailId: number;
    productQuantity: number;
    product: Product;
};

type OrderDetailResponse = {
    orderId: number;
    userId: number;
    bakeryId: number;
    orderDate: string;
    orderStatus: number;    
    orderDetail: OrderDetailItem[];
    totalOrderPrice: number;
};

const OrderDetail = () => {
  // Get OrderDetailByStatus
  const { orderId } = useLocalSearchParams();
  const [orderData, setOrderData] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const handleGetOrderDetailByIdApi = async (id: number) => {
    try {
      const response = await orderCustomerApi().getOrderDetailById({
        orderId: id,
      });
      if (response.status === 200) {
        setOrderData(response.data);
      } else {
        console.error("Failed to fetch order details", response.message);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      handleGetOrderDetailByIdApi(Number(orderId));
    }
  }, [orderId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!orderData) {
    return <Text>No order details available.</Text>;
  }

  const { orderDate, orderDetail, totalOrderPrice } = orderData;


  // Create Order

  return (
    <SafeAreaView className="bg-background h-full flex-1">
      <View className="mx-5">
        <View className="flex-row">
          <BackButton />
          <View className="flex-1 items-center pr-3">
            <TextTitle3 label={new Date(orderDate).toLocaleString("id-ID")} />
          </View>
        </View>

        <Image
          source={require("../../assets/images/map.png")}
          style={{ width: 353, height: 177, marginTop: 40 }}
        />
      </View>
      <View className="flex-row mt-10 bg-white">
        <Image
          source={require("../../assets/images/profile.jpg")}
          style={{
            width: 40,
            height: 40,
            borderRadius: 48,
            marginTop: 8,
            marginBottom: 8,
            marginLeft: 20,
          }}
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
          {orderDetail.map((item) => (
            <View key={item.orderDetailId} className="flex-row justify-between mt-4">
              <View className="flex-row">
                <View className="mr-4">
                  <TextTitle5Bold label={`${item.productQuantity}x`} />
                </View>
                <Text>{item.product.productName}</Text>
              </View>
              <Text>
                Rp {(+item.product.productPrice * item.productQuantity).toLocaleString("id-ID")}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-4 bg-white">
        <View className="mx-5 my-3">
          <View className="flex-row justify-between">
            <TextTitle4 label="Total" />
            <TextTitle4 label={`Rp ${totalOrderPrice.toLocaleString("id-ID")}`} />
          </View>
        </View>
      </View>

      <View className="absolute bottom-0 left-0 right-0 mb-5 mx-5 ">
        <CustomButton
          label="Pesan"
          handlePress={() => {}}
          buttonStyles="w-full"
          isLoading={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default OrderDetail;
