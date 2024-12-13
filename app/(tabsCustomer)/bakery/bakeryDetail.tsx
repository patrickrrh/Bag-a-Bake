import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import ProductCardBakery from "@/components/ProductCardBakery";
import CustomClickableButton from "@/components/CustomClickableButton";
import TextTitle3 from "@/components/texts/TextTitle3";
import TextTitle5 from "@/components/texts/TextTitle5";
import TextTitle5Bold from "@/components/texts/TextTitle5Bold";
import bakeryApi from "@/api/bakeryApi";
import BackButton from "@/components/BackButton";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { FontAwesome } from "@expo/vector-icons";
import {
  convertPhoneNumberFormat,
  formatRupiah,
  getLocalStorage,
  removeLocalStorage,
} from "@/utils/commonFunctions";
import { calculateTotalOrderPrice } from "@/utils/commonFunctions";
import LargeImage from "@/components/LargeImage";
import { images } from "@/constants/images";
import TextRating from "@/components/texts/TextRating";
import OpenCartButton from "@/components/OpenCartButton";
import TextEllipsis from "@/components/TextEllipsis";
import { icons } from "@/constants/icons";
import { BakeryType, OrderItemType } from "@/types/types";
import favoriteApi from "@/api/favoriteApi";
import { useAuth } from "@/app/context/AuthContext";
import TextTitle4 from "@/components/texts/TextTitle4";
import { showToast } from '@/utils/toastUtils';
import Announcement from "@/components/Announcement";

const BakeryDetail = () => {
  const insets = useSafeAreaInsets();

  const { userData } = useAuth();
  const { bakeryId } = useLocalSearchParams();
  const [bakeryDetail, setBakeryDetail] = useState<BakeryType | null>(null);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState("");
  const [orderData, setOrderData] = useState<OrderItemType | null>(null);

  const [showFavorite, setShowFavorite] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(false);

  const [isCancelled, setIsCancelled] = useState(0);

  const handleGetUserById = async () => {
    try {
      const response = await bakeryApi().getUserById({ userId: userData?.userId });
      if (response.status === 200) {
        setIsCancelled(response.data.isCancelled);
      } else {
        console.log("Failed to fetch user data");
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      handleGetUserById();
    }, [userData?.userId])
  );

  useEffect(() => {
    if (isCancelled > 2) {
      setAnnouncementVisible(true);
    } else {
      setAnnouncementVisible(false);
    }
  }, [isCancelled]);

  const fetchOrderData = async () => {
    try {
      const jsonValue = await getLocalStorage("orderData");
      const data: OrderItemType = jsonValue ? JSON.parse(jsonValue) : null;
      setOrderData(data);

      const mappedOrderDetail =
        data?.items.map((item: any) => {
          const product = bakeryDetail?.bakery.product.find(
            (prod) => prod.productId === item.productId
          );
          return {
            product: product || {},
            productQuantity: item.productQuantity,
          };
        }) || [];

      if (mappedOrderDetail.length > 0) {
        const total = calculateTotalOrderPrice(mappedOrderDetail);
        setTotalPrice(total);
      } else {
        setTotalPrice("0");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetBakeryByIdApi = async () => {
    try {
      const response = await bakeryApi().getBakeryById({
        bakeryId: parseInt(bakeryId as string),
      });

      console.log("Bakery Detail", response);

      if (response.status === 200) {
        setBakeryDetail(response.data ? response.data : {});
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (bakeryDetail) {
      fetchOrderData();
    }

    if (bakeryDetail?.bakery?.favorite) {
      const isFavorited = bakeryDetail.bakery.favorite.some(
        (fav) => fav.userId === userData?.userId
      );
      setShowFavorite(isFavorited);
    }
  }, [bakeryDetail]);

  useFocusEffect(
    useCallback(() => {
      handleGetBakeryByIdApi();
    }, [bakeryId])
  );

  const handleContactSeller = (phoneNumber: string) => {
    const formattedPhoneNumber = convertPhoneNumberFormat(phoneNumber);
    const url = `https://wa.me/${formattedPhoneNumber}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Can't handle url: " + url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  console.log("User Data", userData);

  const toggleFavorite = async (bakeryId: number) => {
    const favoriteItem = bakeryDetail?.bakery.favorite.find(
      (fav) => fav.userId === userData?.userId
    );

    try {
      if (favoriteItem) {
        await favoriteApi().removeFavorite(favoriteItem.favoriteId);
      } else {
        await favoriteApi().addFavorite({
          userId: userData?.userId,
          bakeryId: bakeryId,
        });
      }

      handleGetBakeryByIdApi();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View style={{ height: insets.top }} />
      <Announcement
        message="Akun Anda diblokir karena telah membatalkan pesanan lebih dari 3 kali."
        visible={announcementVisible}
        onClose={() => setAnnouncementVisible(false)}
      />
      <View className="flex-row px-5 mb-5 w-full justify-between">
        <BackButton path="/bakery" />
        <TextTitle3 label={bakeryDetail?.bakery.bakeryName as string} />
        <TouchableOpacity
          onPress={() => {
            setShowFavorite(!showFavorite);
            toggleFavorite(bakeryDetail?.bakery.bakeryId as number);
          }}
        >
          {showFavorite ? (
            <Ionicons name="heart" size={24} color="red" />
          ) : (
            <Ionicons name="heart-outline" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View className="mx-5">
          <View className="rounded-lg">
            <LargeImage
              image={{ uri: `${process.env.EXPO_PUBLIC_LOCAL_SERVER}/images/bakery-image/${bakeryDetail?.bakery.bakeryImage}` }}
            />
          </View>

          <View className="mt-5">
            <View className="flex-row justify-between items-start w-full">
              <View className="w-1/2">
                <View className="flex-row mb-2">
                  <Ionicons
                    name="location-sharp"
                    size={14}
                    style={{ marginRight: 5 }}
                  />
                  <View>
                    <TextTitle5
                      label={bakeryDetail?.bakery?.bakeryAddress as string}
                    />
                  </View>
                </View>
              </View>

              <View>
                <CustomClickableButton
                  label={"Hubungi Bakeri"}
                  handlePress={() =>
                    handleContactSeller(
                      bakeryDetail?.bakery.bakeryPhoneNumber as string
                    )
                  }
                  isLoading={isSubmitting}
                  icon="whatsapp"
                  iconColor="#25D366"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/bakery/ratingBakeryCustomer" as any,
                  params: {
                    bakeryId,
                    bakeryName: bakeryDetail?.bakery.bakeryName as string,
                  },
                })
              }
            >
              <View className="flex-row justify-between items-start">
                {/* Informasi Rating di Kiri */}
                <TextRating
                  rating={bakeryDetail?.prevRating.averageRating || "0"}
                  reviewCount={bakeryDetail?.prevRating.reviewCount || "0"}
                />

                {/* Chevron di Kanan */}
                <Ionicons name="chevron-forward" size={14} color="gray" />
              </View>
            </TouchableOpacity>

            <View className="mt-3">
              <TextTitle4 label={"Deskripsi Toko"} />
              <TextTitle5
                label={bakeryDetail?.bakery.bakeryDescription as string}
              />
            </View>

            <View className="flex-row justify-between items-start w-full mt-3">
              <View>
                <TextTitle4 label={"Jam Operasional:"} />
                <TextTitle5
                  label={`${bakeryDetail?.bakery.openingTime} - ${bakeryDetail?.bakery.closingTime}`}
                />
              </View>
              {
                bakeryDetail?.bakery.isHalal === 1 && (
                  <View>
                    <Image
                      source={icons.halalLogo}
                      className='w-12 h-12'
                    />
                  </View>
                )
              }
            </View>

            <View className="h-px bg-gray-200 my-4" />

            <View>
              <TextTitle3 label={"Produk Bakeri"} />
            </View>
          </View>
        </View>

        {bakeryDetail?.bakery?.product.length !== 0 ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
            className="mt-3 mx-4"
          >
            {bakeryDetail?.bakery?.product.map((product) => (
              <View key={product.productId} className="pb-5">
                <ProductCardBakery
                  product={product}
                  isClosed={bakeryDetail.isClosed}
                  isCancelled={isCancelled}
                  onPress={() =>
                    !bakeryDetail.isClosed &&
                    router.push({
                      pathname: "/bakery/inputOrder",
                      params: {
                        productId: product.productId,
                      },
                    })
                  }
                />
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center my-10">
            <Image
              source={icons.bakeBread}
              style={{
                width: 60,
                height: 60,
                marginBottom: 10,
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
                marginInline: 40,
              }}
            >
              Bakeri ini sedang tidak menjual produk, silakan coba lagi nanti
            </Text>
          </View>
        )}
      </ScrollView>

      {orderData && orderData.bakeryId == bakeryDetail?.bakery.bakeryId && (
        isCancelled <= 3 && (
          <View className="w-full flex justify-end p-5">
            <OpenCartButton
              label={`Lihat Keranjang (${orderData.items.length} item)  •  ${totalPrice}`}
              handlePress={() => {
                router.push({
                  pathname: "/inputOrderDetail" as any,
                  params: {
                    bakeryId: bakeryId,
                  },
                });
              }}
              isLoading={isSubmitting}
              icon="bag-outline"
              iconColor="white"
            />
          </View>
        )
      )}
    </View>
  );
};

export default BakeryDetail;
