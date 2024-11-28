import React from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface RatingFilterProps {
  selectedStar: string | number | null;
  setSelectedStar: React.Dispatch<React.SetStateAction<string | number | null>>;
}

const RatingFilter: React.FC<RatingFilterProps> = ({
  selectedStar,
  setSelectedStar,
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
        {[null, 5, 4, 3, 2, 1].map((starValue) => (
          <TouchableOpacity
            key={starValue}
            onPress={() => {
              setSelectedStar(starValue);
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
            {starValue === null ? (
              <Text
                style={{
                  fontSize: 12,
                  color: selectedStar === starValue ? "#FFFFFF" : "#FA6F33",
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
                color={selectedStar === starValue ? "#FFFFFF" : "#FA6F33"}
                style={{ marginRight: 6 }}
              />
            )}
            {starValue !== null && (
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "poppinsRegular",
                  color: selectedStar === starValue ? "#FFFFFF" : "#FA6F33",
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
