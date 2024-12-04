import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import ModalAction from "@/components/ModalAction";

interface BackButtonWithModalProps {
  path?: string;
  params?: Record<string, any>;
  hasUnsavedChanges: () => boolean;
}

const BackButtonWithModal: React.FC<BackButtonWithModalProps> = ({
  path,
  params,
  hasUnsavedChanges,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (hasUnsavedChanges()) {
      setModalVisible(true);
    } else {
      handleRouteChange();
    }
  };

  const handleRouteChange = () => {
    if (path) {
      router.push({
        pathname: path as any,
        params,
      });
    } else {
      router.back();
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.button}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <FontAwesome name="angle-left" size={24} color="#000" />
      </TouchableOpacity>

      {modalVisible && (
        <ModalAction
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          title="Anda memiliki perubahan yang belum disimpan"
          primaryButtonLabel="Lanjutkan"
          secondaryButtonLabel="Keluar"
          onPrimaryAction={() => {
            setModalVisible(false);
          }}
          onSecondaryAction={() => {
            setModalVisible(false);
            handleRouteChange();
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 24,
    height: 24,
  },
});

export default BackButtonWithModal;
