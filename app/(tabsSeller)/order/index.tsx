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
  RefreshControl,
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
  formatDate,
  formatDatewithtime,
  formatRupiah,
  getLocalStorage,
  removeLocalStorage,
} from "@/utils/commonFunctions";
import LoaderKit from "react-native-loader-kit";
import { useAuth } from "@/app/context/AuthContext";
import { generateInvoice, printPDF } from "@/utils/printUtils";
import TextTitle3 from "@/components/texts/TextTitle3";
import { icons } from "@/constants/icons";
import ModalAction from "@/components/ModalAction";
import FilterButton from "@/components/FilterButton";

const Order = () => {
  const { userData } = useAuth();
  const insets = useSafeAreaInsets();

  const [selectedStatus, setSelectedStatus] = useState(1);
  const [filterStatus, setFilterStatus] = useState<number | null>(null);
  const hasManualSelection = useRef(false);
  const [order, setOrder] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderItemId, setOrderItemId] = useState(0);
  const [cancelOrderModal, setCancelOrderModal] = useState(false);

  const handleSelectStatus = (status: number) => {
    setSelectedStatus(status);
    setFilterStatus(null);
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

  const handleFilter = (status: number) => {
    setFilterStatus((prev) => (prev === status ? null : status));
  };

  const filteredOrders = filterStatus
    ? order.filter((item) => item.orderStatus === filterStatus)
    : order;


  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const data = await getLocalStorage("orderSellerParams");
        if (data) {
          const parsedData = JSON.parse(data);
          if (parsedData.status === 5) {
            parsedData.status = 4;
          }
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

  useFocusEffect(
    useCallback(() => {
      handleGetAllOrderByStatusApi();
    }, [selectedStatus])
  )

  const handleRefresh = () => {
    handleGetAllOrderByStatusApi();
  };

  const handleActionOrder = async (orderId: number, orderStatus: number) => {
    try {
      const payload: any = {
        orderId: orderId,
        orderStatus: orderStatus,
      };

      if (orderStatus === 2) {
        payload.paymentStartedAt = new Date().toISOString();
      }

      const response = await orderSellerApi().actionOrder(payload);
      if (response.status === 200) {
        handleGetAllOrderByStatusApi();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrintPDF = async (orderItem: OrderType) => {
    const invoiceHtml = generateInvoice(orderItem, userData);

    try {
      await printPDF(invoiceHtml, `${userData?.bakery.bakeryName}_Invoice_Order${orderItem.orderId}_${formatDate(orderItem.orderDate)}`);
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

        {
          selectedStatus === 4 && (
            <View className="mt-5 mb-3 ml-5 flex-row items-center">
              <FilterButton
              label="Selesai"
              isSelected={filterStatus === 4}
              onPress={() => handleFilter(4)}
            />
            <FilterButton
              label="Dibatalkan"
              isSelected={filterStatus === 5}
              onPress={() => handleFilter(5)}
            />
            </View>
          )
        }

        <View className="flex-1 mx-5">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="small" color="#828282" />
            </View>
          ) : filteredOrders.length === 0 ? (
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
                    ? "Anda tidak memiliki pesanan dalam proses pembayaran"
                    : selectedStatus === 3
                      ? "Anda tidak memiliki pesanan berlangsung"
                      : "Anda belum memiliki riwayat pesanan"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredOrders}
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
                    onReject={() => { setCancelOrderModal(true); setOrderItemId(item.orderId) }}
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
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={handleRefresh}
                />
              }
            />
          )}
        </View>
      </View>

      <ModalAction
        modalVisible={cancelOrderModal}
        setModalVisible={setCancelOrderModal}
        title="Apakah Anda yakin ingin membatalkan pesanan ini?"
        primaryButtonLabel="Kembali"
        secondaryButtonLabel="Batalkan Pesanan"
        onPrimaryAction={() => setCancelOrderModal(false)}
        onSecondaryAction={() => handleActionOrder(orderItemId, 5)}
      />
    </View>
  );
};

export default Order;
