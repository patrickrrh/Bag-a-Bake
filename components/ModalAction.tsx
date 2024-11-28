import { View, Text, Modal } from "react-native";
import React from "react";
import ModalActionButton from "@/components/ModalActionButton";
import { router } from "expo-router";

interface ModalActionProps {
  setModalVisible: (visible: boolean) => void;
  modalVisible: boolean;
  title: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
}

const ModalAction: React.FC<ModalActionProps> = ({
  setModalVisible,
  modalVisible,
  title,
  primaryButtonLabel,
  secondaryButtonLabel,
  onPrimaryAction,
  onSecondaryAction,
}) => {

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
            paddingInline: 20,
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
              fontFamily: "poppinsSemiBold",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {title}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <ModalActionButton
              label={secondaryButtonLabel}
              handlePress={() => {
                setModalVisible(false);
                onSecondaryAction();
              }}
              variant="outline"
              isLoading={false}
            />
            <ModalActionButton
              label={primaryButtonLabel}
              handlePress={() => {
                setModalVisible(false);
                onPrimaryAction();
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

export default ModalAction;
