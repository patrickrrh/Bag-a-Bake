import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import TextTitle3 from './texts/TextTitle3';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextTitle5Gray from './texts/TextTitle5Gray';
import { Ionicons } from '@expo/vector-icons';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import TextEllipsis from './TextEllipsis';
import TextRating from './texts/TextRating';

interface Props {
    item: any;
    onPress: () => void;
    onFavorite: () => void;
    userId?: any;
    isCancelled?: any;
}

type Favorite = {
    bakeryId: number;
    favoriteId: number;
    userId: number;
}

const BakeryCard: React.FC<Props> = ({ item, onPress, onFavorite, userId, isCancelled }) => {
    const isDisabled = item.isClosed || (isCancelled > 2);

    return (
        <TouchableOpacity
            className="bg-white rounded-lg shadow-sm mb-5 p-4"
            onPress={onPress}
            style={{ opacity: isDisabled ? 0.2 : 1 }}
        >
            <View className="flex-row items-start justify-between">
                <View className="flex-row p-1">
                    <Image
                        source={{ uri: item.bakeryImage }}
                        style={{ width: 68, height: 68, borderRadius: 10, borderColor: '#000', borderWidth: 1 }}
                    />
                    <View className="ml-5" style={{ flex: 1 }}>
                        <View className="flex-row justify-between w-full">
                            <TextTitle3 label={item.bakeryName} />
                            <TouchableOpacity onPress={onFavorite}>
                                <Ionicons
                                    name={item.favorite.some((fav: Favorite) => fav.bakeryId === item.bakeryId) ? "heart" : "heart-outline"}
                                    size={24}
                                    color={item.favorite.some((fav: Favorite) => fav.bakeryId === item.bakeryId) ? "red" : "gray"}
                                />
                            </TouchableOpacity>
                        </View>

                        <TextRating
                            rating={item.rating.averageRating || "0"}
                            reviewCount={item.rating.reviewCount || "0"}
                        />

                        <View className="flex-col mt-1">
                            <TextTitle5Gray label={`Jarak: ${item.distanceInKm} km`} />
                            <View className="flex-row items-start mt-1">
                                <Ionicons name="location-sharp" size={12} color="black" style={{ marginRight: 5 }} />
                                <View style={{ flex: 1, paddingRight: 20 }}>
                                    <TextEllipsis label={item.bakeryAddress} line={1} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default BakeryCard;
