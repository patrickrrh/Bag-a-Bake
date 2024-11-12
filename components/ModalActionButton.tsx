import { TouchableOpacity, Text } from "react-native";
import React from "react";

interface Props {
  label: string;
  handlePress: () => void;
  isLoading: boolean;
  variant?: "solid" | "outline";
}

const ModalActionButton: React.FC<Props> = ({
  label,
  handlePress,
  isLoading,
  variant = "solid",
}) => {
  const buttonStyles =
    variant === "solid" ? "bg-brown" : "border border-brown bg-transparent";

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={{
        maxWidth: 120,
        width: "100%",
      }}
      className={`rounded-xl px-4 py-2 min-h-[40px] justify-center items-center ${buttonStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text
        style={{
          fontFamily: "poppinsRegular",
          fontSize: 12,
          color: variant === "solid" ? "white" : "#b0795a",
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default ModalActionButton;
