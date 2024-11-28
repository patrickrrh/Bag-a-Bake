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
    ActivityIndicator,
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
import { icons } from "@/constants/icons";

interface User {
    userId: number;
    userName: string;
    userImage: string;
}

interface Order {
    orderId: number;
    user: User;
}

type Rating = {
    filteredRatings: {
        ratingId: number;
        orderId: number;
        rating: number;
        review: string;
        createdDate: Date;
        order: Order;
    }[];
    ratingCount: number;
    averageRating: number;
    reviewCount: number;
}

const RatingBakerySeller = () => {

    const insets = useSafeAreaInsets();

    const { bakeryId, bakeryName } = useLocalSearchParams();
    const [rating, setRating] = useState<Rating | null>(null);
    const [selectedStar, setSelectedStar] = useState<string | number | null>("all");
    const [isLoading, setIsLoading] = useState(false);

    const handleGetRatings = async () => {
        setIsLoading(true);
        setRating(null);
        try {
            if (selectedStar === "all") {
                setSelectedStar(null);
            }
            const response = await ratingApi().findBakeryRating({
                bakeryId: parseInt(bakeryId as string),
                star: selectedStar,
            });

            if (response.status === 200) {
                setRating(response.data);
            }

            console.log(response.data);
        } catch (error) {
            console.log(error);
        }

        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };

    useFocusEffect(
        useCallback(() => {
            handleGetRatings();
        }, [selectedStar])
    )

    console.log("ratings", JSON.stringify(rating, null, 2))

    return (
        <View className="bg-background h-full flex-1">

            <View style={{ height: insets.top }} />

            <View className="flex-row items-center px-5 relative">
                {/* Back Button */}
                <View>
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
                            {rating?.averageRating}
                        </Text>
                        <FontAwesome
                            name="star"
                            size={32}
                            color="#FA6F33"
                            style={{ marginLeft: 8, paddingBottom: 6 }}
                        />
                    </View>

                    <Text style={{ fontSize: 16, color: "#828282", marginTop: 5, fontFamily: "poppinsRegular" }}>
                        {rating?.ratingCount} penilaian • {rating?.reviewCount} ulasan
                    </Text>
                </View>

                <RatingFilter
                    selectedStar={selectedStar}
                    setSelectedStar={setSelectedStar}
                />
                {
                    isLoading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="small" color="#828282" />
                        </View>
                    ) : (
                        rating?.filteredRatings.length === 0 ? (
                            <View className="flex-1 items-center justify-center">
                                <Image
                                    source={icons.noStar}
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
                                    Tidak ada penilaian
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={rating?.filteredRatings}
                                keyExtractor={(item) => item.ratingId.toString()}
                                renderItem={({ item }) => <ListRatingCard item={item} />}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            />
                        )
                    )
                }


            </View>
        </View>
    );
};

export default RatingBakerySeller;
