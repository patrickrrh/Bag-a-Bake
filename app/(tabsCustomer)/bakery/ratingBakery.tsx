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
import ratingApi from "@/api/ratingApi";
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
import ListProductCard from "@/components/ListProductCard";
import ListRatingCard from "@/components/ListRatingCard";
import RatingFilter from "@/components/RatingFilter";

interface User {
  userId: number;
  userName: string;
  userImage: string;
}

interface Order {
  orderId: number;
  user: User;
}

interface Rating {
  ratingId: number;
  orderId: number;
  rating: number;
  review: string;
  createdDate: Date;
  order: Order;
  averageRating: number;
  reviewCount: number;
}

const RatingBakery = () => {
  const insets = useSafeAreaInsets();

  const { bakeryId, bakeryName } = useLocalSearchParams();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [selectedStar, setSelectedStar] = useState<string | number | null>("all");

  const handleGetRatings = async (star: string | number | null) => {
    try {
      const response = await ratingApi().findBakeryRating({
        bakeryId: parseInt(bakeryId as string),
        star: star,
      });

      setRatings(response.data);
      setAverageRating(response.averageRating);
      setReviewCount(response.reviewCount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetRatings(null);
  }, []);

  const formattedAverageRating = averageRating.toFixed(1).replace(".", ",");

  return (
    <View className="bg-background h-full flex-1">
      <View style={{ height: insets.top }} />

      <View
        style={{
          backgroundColor: "#FEFAF9",
          height: insets.top,
        }}
      />

      <View className="flex-row items-center px-4 pb-2 relative">
        {/* Back Button */}
        <View className="pl-5">
          <BackButton />
        </View>

        {/* Title */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextTitle3 label={`Penilaian ${bakeryName}`} />
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <View style={{ marginTop: 32, marginBottom: 32, alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 32, color: "#333", fontFamily: "poppinsSemiBold" }}>
              {formattedAverageRating}
            </Text>
            <FontAwesome
              name="star"
              size={32}
              color="#FA6F33"
              style={{ marginLeft: 8, paddingBottom: 6 }}
            />
          </View>

          <Text style={{ fontSize: 16, color: "#666", marginTop: 5, fontFamily: "poppinsRegular" }}>
            {reviewCount} ulasan
          </Text>
        </View>

        <RatingFilter
          selectedStar={selectedStar}
          setSelectedStar={setSelectedStar}
          handleGetRatings={handleGetRatings}
        />

        <FlatList
          data={ratings}
          keyExtractor={(item) => item.ratingId.toString()}
          renderItem={({ item }) => <ListRatingCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
};

export default RatingBakery;
