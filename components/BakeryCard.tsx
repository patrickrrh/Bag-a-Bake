import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import TextTitle3 from './texts/TextTitle3';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextTitle5Gray from './texts/TextTitle5Gray';
import { Ionicons } from '@expo/vector-icons';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import TextEllipsis from './TextEllipsis';

interface Props {
    item: any;
    onPress: () => void;
    onFavorite: () => void;
}

type Favorite = {
    bakeryId: number;
    favoriteId: number;
    userId: number;
}

const BakeryCard: React.FC<Props> = ({ item, onPress, onFavorite }) => {

    return (
        <TouchableOpacity
            className="bg-white rounded-lg shadow-sm mb-4 p-4"
            onPress={onPress}
        >
            <View className="flex-row items-start justify-between">
                <View className="flex-row p-1">
                    <Image
                        source={{ uri: item.bakeryImage }}
                        style={{ width: 68, height: 68, borderRadius: 10, borderColor: '#000', borderWidth: 1 }}
                    />
                    <View className="ml-5">
                        <View className='flex-row justify-between'>
                            <TextTitle3 label={item.bakeryName} />
                            <TouchableOpacity onPress={onFavorite}>
                                <Ionicons
                                    name={item.favorite.some((fav: Favorite) => fav.bakeryId === item.bakeryId) ? "heart" : "heart-outline"}
                                    size={24}
                                    color={item.favorite.some((fav: Favorite) => fav.bakeryId === item.bakeryId) ? "red" : "gray"}
                                />
                            </TouchableOpacity>
                        </View>
                        <TextTitle5Gray label={`Jarak: ${item.distanceInKm} km`} />
                        <View className="flex-row items-start mt-2">
                            <Ionicons name="location-sharp" size={12} color="black" style={{ marginRight: 5 }} />
                            <View style={{ width: 200 }}>
                                <TextEllipsis label={item.bakeryAddress} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default BakeryCard;
