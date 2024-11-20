import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";

interface ModalInformationProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const ModalInformation: React.FC<ModalInformationProps> = ({
  visible,
  onClose,
  title,
  content,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            width: "80%",
            paddingVertical: 30,
            paddingHorizontal: 20,
            backgroundColor: "#FFFFFF",
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "poppinsBold",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "poppinsRegular",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            {content}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: "#4CAF50",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontFamily: "poppinsBold",
                  fontSize: 14,
                }}
              >
                Saya Mengerti
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalInformation;
