import OrderStatusTab from "@/components/OrderStatusTab";
import SearchBar from "@/components/SearchBar";
import TextHeader from "@/components/texts/TextHeader";
import TextTitle3 from "@/components/texts/TextTitle3";
import TextTitle5 from "@/components/texts/TextTitle5";
import TextRating from "@/components/texts/TextRating";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Animated,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  RefreshControl,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import TextTitle4 from "@/components/texts/TextTitle4";
import OrderCard from "@/components/OrderCard";
import TextTitle5Date from "@/components/texts/TextTitle5Date";
import orderCustomerApi from "@/api/orderCustomerApi";
import { router, useFocusEffect } from "expo-router";
import { OrderType } from "@/types/types";
import OrderCardWithRating from "@/components/OrderCardWithRating";
import { FontAwesome } from "@expo/vector-icons";
import { AirbnbRating, Rating } from "react-native-ratings";
import TextAreaField from "@/components/TextAreaField";
import CustomButton from "@/components/CustomButton";
import ErrorMessage from "@/components/texts/ErrorMessage";
import ratingApi from "@/api/ratingApi";
import RatingInput from "@/components/RatingInput";
import { getLocalStorage, removeLocalStorage } from "@/utils/commonFunctions";
import { icons } from "@/constants/icons";
import { useAuth } from "@/app/context/AuthContext";

type RatingErrorState = {
  rating: string | null;
};

const Order = () => {
  const { userData } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState(1);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [ratingOrderId, setRatingOrderId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [ratingModal, setRatingModal] = useState(false);

  const emptyRatingForm = {
    rating: 0,
    review: "",
  };
  const [ratingForm, setRatingForm] = useState(emptyRatingForm);

  const emptyRatingError = {
    rating: null,
  };
  const [ratingError, setRatingError] =
    useState<RatingErrorState>(emptyRatingError);

  const insets = useSafeAreaInsets();

  const handleSelectStatus = (status: number) => {
    setOrders([]);
    setSelectedStatus(status);
  };

  const handleGetOrderByStatusApi = async () => {
    setIsLoading(true);
    try {
      const response = await orderCustomerApi().getOrderByStatus({
        userId: userData?.userId,
        orderStatus: selectedStatus,
      });
      if (response.status === 200) {
        setOrders(response.data ? response.data : []);
      }
    } catch (error) {
      console.error(error);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  useFocusEffect(
    useCallback(() => {
      handleGetOrderByStatusApi();
    }, [selectedStatus])
  )

  const handleRefresh = () => {
    handleGetOrderByStatusApi();
  };

  const handleSubmitRatingApi = async () => {
    try {
      if (ratingForm.rating === 0) {
        setRatingError((prevError) => ({
          ...prevError,
          rating: "Rating harus diisi",
        }));
        return;
      }

      const response = await ratingApi().createRating({
        ...ratingForm,
        orderId: ratingOrderId,
      });

      if (response.status === 201) {
        setRatingModal(false);
        setRatingOrderId(0);
        setRatingError(emptyRatingError);
        setRatingForm(emptyRatingForm);
        handleGetOrderByStatusApi();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setOrders([]);
      const fetchData = async () => {
        const data = await getLocalStorage("orderCustomerParams");
        if (data) {
          const parsedData = JSON.parse(data);
          if (parsedData.status === 5) {
            parsedData.status = 4;
          }
          setSelectedStatus(parsedData.status);
        }
      };

      fetchData();

      return () => {
        removeLocalStorage("orderCustomerParams");
      };
    }, [])
  );

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
                selectedStatus={selectedStatus || 1}
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
          ) : orders.length === 0 ? (
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
              data={orders}
              renderItem={({ item }) =>
                item.orderStatus === 4 && item.isRated === false ? (
                  <OrderCardWithRating
                    item={item}
                    onPress={() => {
                      router.push({
                        pathname: "/order/orderDetail" as any,
                        params: { order: JSON.stringify(item) },
                      });
                    }}
                    onPressRating={() => {
                      setRatingModal(true);
                      setRatingOrderId(item.orderId);
                    }}
                  />
                ) : (
                  <OrderCard
                    item={item}
                    onPress={() => {
                      router.push({
                        pathname: "/order/orderDetail" as any,
                        params: { order: JSON.stringify(item) },
                      });
                    }}
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

      <Modal
        visible={ratingModal}
        onRequestClose={() => setRatingModal(false)}
        animationType="fade"
        presentationStyle="overFullScreen"
        transparent
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{
                  height: "50%",
                  backgroundColor: "#FEFAF9",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  padding: 20,
                  width: "100%",
                }}
              >
                <View className="items-end">
                  <TouchableOpacity
                    onPress={() => {
                      setRatingModal(false);
                      setRatingOrderId(0);
                      setRatingError(emptyRatingError);
                      setRatingForm(emptyRatingForm);
                    }}
                  >
                    <FontAwesome name="close" size={18} color="#B0795A" />
                  </TouchableOpacity>
                </View>
                <View className="items-center mt-2">
                  <RatingInput
                    rating={ratingForm.rating}
                    onRatingChange={(rating) => {
                      setRatingForm((prevForm) => ({
                        ...prevForm,
                        rating: rating,
                      }));
                      setRatingError((prevError) => ({
                        ...prevError,
                        rating: null,
                      }));
                    }}
                  />
                  {ratingError.rating && (
                    <ErrorMessage label={ratingError.rating} />
                  )}
                </View>
                <TextAreaField
                  label="Berikan ulasan Anda"
                  value={ratingForm.review}
                  onChangeText={(text) => {
                    setRatingForm((prevForm) => ({
                      ...prevForm,
                      review: text,
                    }));
                  }}
                  keyboardType="default"
                  moreStyles="mt-7"
                />
                <CustomButton
                  label="Kirim"
                  handlePress={() => {
                    handleSubmitRatingApi();
                  }}
                  buttonStyles="mt-7"
                  isLoading={isLoading}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default Order;
