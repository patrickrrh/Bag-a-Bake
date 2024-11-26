import React from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface RatingFilterProps {
  selectedStar: string | number | null;
  setSelectedStar: React.Dispatch<React.SetStateAction<string | number | null>>;
  handleGetRatings: (starValue: string | number | null) => void;
}

const RatingFilter: React.FC<RatingFilterProps> = ({
  selectedStar,
  setSelectedStar,
  handleGetRatings,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 16,
        marginBottom: 16,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["all", 5, 4, 3, 2, 1].map((starValue) => (
          <TouchableOpacity
            key={starValue}
            onPress={() => {
              setSelectedStar(starValue);
              handleGetRatings(starValue === "all" ? null : starValue);
            }}
            style={{
              paddingVertical: 4,
              paddingHorizontal: 10,
              marginHorizontal: 4,
              backgroundColor:
                selectedStar === starValue ? "#FA6F33" : "#FFFFFF",
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {starValue === "all" ? (
              <Text
                style={{
                  fontSize: 12,
                  color: selectedStar === starValue ? "#f3f4f6" : "#FA6F33",
                  textAlign: "center",
                  fontFamily: "poppinsRegular",
                }}
              >
                Semua
              </Text>
            ) : (
              <FontAwesome
                name="star"
                size={14}
                color={selectedStar === starValue ? "#f3f4f6" : "#FA6F33"}
                style={{ marginRight: 6 }}
              />
            )}
            {starValue !== "all" && (
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "poppinsRegular",
                  color: selectedStar === starValue ? "#FFF2EB" : "#FA6F33",
                }}
              >
                {starValue}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default RatingFilter;
