import { View, Text, Modal } from "react-native";
import React from "react";
import ModalSubmissionButton from "@/components/ModalSubmissionButton";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

interface ModalProps {
  setModalVisible: (visible: boolean) => void;
  modalVisible: boolean;
}

const ModalEditSubmission: React.FC<ModalProps> = ({
  setModalVisible,
  modalVisible,
}) => {
  const navigation = useNavigation();

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
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
            paddingTop: 30,
            paddingBottom: 30,
            paddingLeft: 20,
            paddingRight: 20,
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
            Produk berhasil diperbarui!
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
            }}
          >
            <ModalSubmissionButton
              label="Lanjut Sunting Produk"
              handlePress={() => {
                setModalVisible(false);
              }}
              variant="outline"
              isLoading={false}
            />
            <ModalSubmissionButton
              label="Kembali ke Daftar Produk"
              handlePress={() => {
                setModalVisible(false);
                router.push("/product");
              }}
              variant="solid"
              isLoading={false}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalEditSubmission;
