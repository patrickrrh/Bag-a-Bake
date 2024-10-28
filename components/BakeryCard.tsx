import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import TextTitle3 from './texts/TextTitle3';
import TextTitle5 from '@/components/texts/TextTitle5';
import TextTitle5Gray from './texts/TextTitle5Gray';
import { Ionicons } from '@expo/vector-icons';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';

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
                        source={images.logo}
                        style={{ width: 68, height: 68, borderRadius: 10, borderColor: '#000', borderWidth: 1 }}
                    />
                    <View className="ml-5">
                        <TextTitle3 label={item.bakeryName} />
                        <TextTitle5Gray label={"Jarak: " + 2 + " km"} />
                        <View className="flex-row items-center mt-2">
                            <Image
                                source={icons.location}
                                style={{ width: 12, height: 12, marginRight: 5 }}
                            />
                            <TextTitle5 label={item.regionBakery.regionName} />
                        </View>
                    </View>
                </View>
                <View>
                    <TouchableOpacity onPress={onFavorite}>
                        <Ionicons
                            name={item.favorite.some((fav: Favorite) => fav.bakeryId === item.bakeryId) ? "heart" : "heart-outline"}
                            size={24}
                            color={item.favorite.some((fav: Favorite) => fav.bakeryId === item.bakeryId) ? "red" : "gray"}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default BakeryCard;
