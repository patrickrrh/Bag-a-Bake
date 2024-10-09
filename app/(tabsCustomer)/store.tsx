import SearchBar from "@/components/SearchBar";
import TextHeader from "@/components/texts/TextHeader";
import TextTitle3 from "@/components/texts/TextTitle3";
import TextTitle5 from "@/components/texts/TextTitle5";
import TextTitle5Gray from "@/components/texts/TextTitle5Gray";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getItemAsync } from "expo-secure-store";

const Toko = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]); // Store favorite store ids
  const [showFavorites, setShowFavorites] = useState(false);

  const stores = [
    {
      id: 1,
      name: "Berkat Bakery",
      location: "Pacific Garden, Alam Sutera",
      rating: 4.2,
      reviews: 20,
      distance: 3,
    },
    {
      id: 2,
      name: "Nelnel Bakery",
      location: "Pacific Garden, Alam Sutera",
      rating: 4.2,
      reviews: 20,
      distance: 5,
    },
  ];

  const filteredStores = stores.filter((store) => {
    const isMatch = store.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return showFavorites ? isMatch && favorites.includes(store.id) : isMatch;
  });

  // Toggle favorite state
  const toggleFavorite = (storeId: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(storeId)
        ? prevFavorites.filter((id) => id !== storeId)
        : [...prevFavorites, storeId]
    );
  };

  return (
    <SafeAreaView className="bg-background h-full flex-1">
      <View className="mx-5">
        <View className="flex-row align-center justify-between">
          <TextHeader label="BAKERI" />
          <TouchableOpacity
            onPress={() => setShowFavorites(!showFavorites)}
            style={{
              backgroundColor: showFavorites
                ? "rgba(255, 0, 0, 0.2)"
                : "rgba(0, 0, 0, 0.1)", 
              borderRadius: 25,
              padding: 8,
            }}
          >
            <Ionicons
              name="heart"
              size={24}
              color={showFavorites ? "red" : "gray"} 
            />
          </TouchableOpacity>
        </View>
        <View className="mt-5">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </View>
        <View className="mt-5">
          <FlatList
            data={filteredStores}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="bg-white rounded-lg shadow-md mb-4 p-4">
                <View className="flex-row my-3 items-end justify-between">
                  <View className="flex-row">
                    <Image
                      source={require("../../assets/images/bakery1.png")}
                      style={{ width: 68, height: 68, borderRadius: 10 }}
                    />

                    <View className="ml-4">
                      <TextTitle3 label={item.name} />
                      <TextTitle5Gray
                        label={"Distance: " + item.distance.toString() + " km"}
                      />
                      {/* <View className="flex-row items-center">
                              <View className='pr-1'>
                                <Image 
                                    source={require('../../assets/images/starFillIcon.png')}
                                    style={{ width: 12, height: 12 }}
                                />
                              </View>
                              <View className='pr-1 pt-1'>
                                <TextRating label={"4.5"} />
                              </View>
                              <View className='pt-1'>
                                <TextTitle5 label={"(20 ulasan)"} />
                              </View>
                            </View> */}

                      <View className="flex-row items-center">
                        <View className="pr-1">
                          <Image
                            source={require("../../assets/images/locationIcon.png")}
                            style={{ width: 12, height: 12 }}
                          />
                        </View>
                        <View className="pr-1 pt-1">
                          <TextTitle5 label={item.location} />
                        </View>
                      </View>
                    </View>
                    <View className="align-items-end pl-5">
                      <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                        <Ionicons
                          name={
                            favorites.includes(item.id)
                              ? "heart"
                              : "heart-outline"
                          }
                          size={24}
                          color={favorites.includes(item.id) ? "red" : "gray"}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Toko;
