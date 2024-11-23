import {
  View,
  Text,
  Image,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import UploadButton from "@/components/UploadButton";
import { Picker } from "@react-native-picker/picker";
import TextHeader from "@/components/texts/TextHeader";
import OrderStatusTab from "@/components/OrderStatusTab";
import orderSellerApi from "@/api/orderSellerApi";
import SellerOrderCardPending from "@/components/SellerOrderCardPending";
import SellerOrderCard from "@/components/SellerOrderCard";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OrderType } from "@/types/types";
import {
  formatDatewithtime,
  formatRupiah,
  getLocalStorage,
  removeLocalStorage,
} from "@/utils/commonFunctions";
import LoaderKit from "react-native-loader-kit";
import { useAuth } from "@/app/context/AuthContext";
import { printPDF } from "@/utils/printUtils";
import TextTitle3 from "@/components/texts/TextTitle3";
import { icons } from "@/constants/icons";

const Order = () => {
  const { userData } = useAuth();
  const insets = useSafeAreaInsets();

  const [selectedStatus, setSelectedStatus] = useState(1);
  const hasManualSelection = useRef(false);
  const [order, setOrder] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectStatus = (status: number) => {
    setSelectedStatus(status);
    hasManualSelection.current = true;
  };

  const handleGetAllOrderByStatusApi = async () => {
    setIsLoading(true);
    try {
      const response = await orderSellerApi().getAllOrderByStatus({
        orderStatus: selectedStatus,
        bakeryId: userData?.bakery?.bakeryId,
      });
      if (response.status === 200) {
        setOrder(response.data || null);
      }
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const data = await getLocalStorage("orderSellerParams");
        if (data) {
          const parsedData = JSON.parse(data);
          setSelectedStatus(parsedData.status);
        }
      };

      fetchData();
      if (!hasManualSelection.current) {
        handleGetAllOrderByStatusApi();
      }

      return () => {
        removeLocalStorage("orderSellerParams");
      };
    }, [])
  );

  useEffect(() => {
    handleGetAllOrderByStatusApi();
  }, [selectedStatus]);

  const handleActionOrder = async (orderId: number, orderStatus: number) => {
    try {
      const response = await orderSellerApi().actionOrder({
        orderId: orderId,
        orderStatus: orderStatus,
      });
      if (response.status === 200) {
        handleGetAllOrderByStatusApi();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generateInvoice = (orderItem: OrderType) => {
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: Arial, sans-serif; background-color: #FEFAF9; margin: 30px auto; padding: 0; }
            h1, h2 { text-align: center; margin: 10px 0; }
            .details-container {
              width: 90%; 
              margin: 20px auto;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 20px; /* Ensures some spacing between left and right sections */
            }
            .details-left, .details-right {
              display: flex;
              flex-direction: column;
            }
            .details-left p, .details-right p {
              margin: 5px 0;
            }
            table { width: 90%; margin: 30px auto; border-collapse: collapse; background-color: #fff; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .total-container { 
              width: 90%; 
              margin: 20px auto; 
              display: flex; 
              justify-content: flex-end; 
              font-weight: bold; 
            }
            .total-container span { margin-left: 10px; }
          </style>
        </head>
        <body>
          <h1>Invoice</h1>
          <h2>ID Pesanan: ${orderItem.orderId}</h2>
          <div class="details-container">
            <div class="details-left">
              <p><strong>${userData?.bakery?.bakeryName}</strong></p>
              <p>Tanggal Pesanan: ${formatDatewithtime(orderItem.orderDate)}</p>
            </div>
            <div class="details-right">
              <p>Pembeli: ${orderItem.user.userName}</p>
              <p>No Telepon: ${orderItem.user.userPhoneNumber}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Jumlah</th>
                <th>Harga</th>
              </tr>
            </thead>
            <tbody>
              ${orderItem.orderDetail
                .map(
                  (item) => `
                <tr>
                  <td>${item.product.productName}</td>
                  <td>${item.productQuantity}</td>
                  <td>${formatRupiah(item.totalDetailPrice)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <div class="total-container">
            <p>Total: ${formatRupiah(orderItem.totalOrderPrice)}</p>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrintPDF = async (orderItem: OrderType) => {
    const invoiceHtml = generateInvoice(orderItem);

    try {
      await printPDF(invoiceHtml);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("order", JSON.stringify(order, null, 2));

  return (
    <View className="flex-1">
      <View
        style={{
          backgroundColor: "white",
          height: insets.top,
        }}
      />

      <View className="bg-background h-full flex-1">
        <View className="bg-white">
          <View className="mx-5">
            <TextHeader label="PESANAN" />
            <View className="mt-6">
              <OrderStatusTab
                selectedStatus={selectedStatus}
                onSelectStatus={handleSelectStatus}
              />
            </View>
          </View>
        </View>

        <View className="flex-1 mx-5">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="small" color="#828282" />
            </View>
          ) : order.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Image
                source={icons.noFile}
                style={{
                  width: 80,
                  height: 80,
                  marginBottom: 20,
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
                }}
              >
                {selectedStatus === 1
                  ? "Anda tidak memiliki pesanan baru"
                  : selectedStatus === 2
                  ? "Anda tidak memiliki pesanan berlangsung"
                  : "Anda belum memiliki riwayat pesanan"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={order}
              renderItem={({ item }) =>
                item.orderStatus === 1 ? (
                  <SellerOrderCardPending
                    order={item}
                    onPress={() => {
                      router.push({
                        pathname: "/order/orderDetail",
                        params: { order: JSON.stringify(item) },
                      });
                    }}
                    onAccept={() => handleActionOrder(item.orderId, 2)}
                    onReject={() => handleActionOrder(item.orderId, 4)}
                  />
                ) : (
                  <SellerOrderCard
                    order={item}
                    onPress={() => {
                      router.push({
                        pathname: "/order/orderDetail",
                        params: { order: JSON.stringify(item) },
                      });
                    }}
                    printPdf={() => handlePrintPDF(item)}
                  />
                )
              }
              keyExtractor={(item) => item.orderId.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default Order;
