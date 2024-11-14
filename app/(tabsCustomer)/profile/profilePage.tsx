import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import UploadButton from "@/components/UploadButton";
import CustomButton from "@/components/CustomButton";
import CustomButtonOutline from "@/components/CustomButtonOutline";
import * as ImagePicker from "expo-image-picker";
import { router, Href } from "expo-router";
import TextHeader from "@/components/texts/TextHeader";
import { useAuth } from "@/app/context/AuthContext";
import CustomDropdown from "@/components/CustomDropdown";
import regionApi from "@/api/regionApi";
import authenticationApi from "@/api/authenticationApi";
import { showToast } from "@/utils/toastUtils";
import { checkEmptyForm } from "@/utils/commonFunctions";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import ModalAction from "@/components/ModalAction";
import Toast from "react-native-toast-message";

type ErrorState = {
  userName: string | null;
  userPhoneNumber: string | null;
  regionId: number | null;
  email: string | null;
};

const EditProfile = () => {
  const { userData, refreshUserData, signOut } = useAuth();

  const [form, setForm] = useState({
    userName: userData?.userName || "",
    userPhoneNumber: userData?.userPhoneNumber || "",
    email: userData?.email || "",
    userImage: userData?.userImage || "",
    regionId: userData?.regionId || 0,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const emptyError: ErrorState = {
    userName: null,
    userPhoneNumber: null,
    regionId: null,
    email: null,
  };
  const [error, setError] = useState<ErrorState>(emptyError);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, userImage: result.assets[0].uri });
    }
  };

  const hasUnsavedChanges = () => {
    return (
      form.userName !== userData?.userName ||
      form.userPhoneNumber !== userData?.userPhoneNumber ||
      form.email !== userData?.email ||
      form.userImage !== userData?.userImage ||
      form.regionId !== userData?.regionId
    );
  };

  const [nextRoute, setNextRoute] = useState<Href | null>(null);
  const handleRouteChange = () => {
    if (nextRoute) {
      router.push(nextRoute);
    } else {
      router.replace("/(tabsCustomer)/profile");
    }
  };

  const handlePasswordChange = () => {
    console.log("UNSAVED CHANGES?", hasUnsavedChanges());
    if (hasUnsavedChanges()) {
      setNextRoute("/(tabsCustomer)/profile/changePassword");
      setModalVisible(true);
    } else {
      router.push("/(tabsCustomer)/profile/changePassword");
    }
  };

  const handleSubmitChange = () => {
    if (hasUnsavedChanges()) {
      setNextRoute("/(tabsCustomer)/profile");
      setModalVisible(true);
    } else {
      router.push("/(tabsCustomer)/profile");
    }
  };

  const handleSaveChanges = async () => {
    try {
      setisSubmitting(true);

      const errors = checkEmptyForm(form);
      if (Object.values(errors).some((error) => error !== null)) {
        setError(errors as ErrorState);
        return;
      }

      await authenticationApi().updateUser({
        userId: userData?.userId,
        userName: form.userName,
        userPhoneNumber: form.userPhoneNumber,
        email: form.email,
        userImage: form.userImage,
        regionId: form.regionId,
      });

      const userDataToStore = {
        ...form,
        userId: userData?.userId
      };

      await SecureStore.setItemAsync(
        "userData",
        JSON.stringify(userDataToStore)
      );

      await refreshUserData();

      router.replace("/(tabsCustomer)/profile");
    } catch (error) {
      console.log(error);
      showToast("error", "An unexpected error occurred");
    } finally {
      setisSubmitting(false);
    }
  };

  const [isSubmitting, setisSubmitting] = useState(false);
  const [region, setRegion] = useState([]);

  const handleGetRegionAPI = async () => {
    try {
      const response = await regionApi().getRegion();
      if (response.status === 200) {
        setRegion(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetRegionAPI();
  }, []);

  return (
    <SafeAreaView className="bg-background h-full flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>

      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <Toast topOffset={50} />
      </View>
        <View style={{ paddingHorizontal: 20, flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextHeader label="Profil Saya" />

            <TouchableOpacity
              onPress={() => setLogoutModalVisible(true)}
              style={{ position: "absolute", right: 0 }}
            >
              <Ionicons name="log-out-outline" size={24} color="#b0795a" />
            </TouchableOpacity>
          </View>

          <View className="mt-4 w-full items-center" style={{ marginTop: 48 }}>
            <View className="w-24 h-24 border border-gray-200 rounded-full mb-4">
              <Image
                source={{ uri: form.userImage }}
                className="w-full h-full rounded-full"
              />
            </View>
            <UploadButton label="Unggah Foto" handlePress={pickImage} />
          </View>

          <FormField
            label="Nama Pengguna"
            value={form.userName}
            onChangeText={(text) => {
              setForm({ ...form, userName: text });
              setError((prevError) => ({ ...prevError, userName: null }));
            }}
            keyboardType="default"
            moreStyles="mt-7"
            error={error.userName}
          />

          <FormField
            label="Nomor Telepon"
            value={form.userPhoneNumber}
            onChangeText={(text) => {
              setForm({ ...form, userPhoneNumber: text });
              setError((prevError) => ({
                ...prevError,
                userPhoneNumber: null,
              }));
            }}
            keyboardType="phone-pad"
            moreStyles="mt-7"
            error={error.userPhoneNumber}
          />

          <CustomDropdown
            label="Lokasi"
            data={region}
            value={form.regionId}
            placeholder="Pilih lokasi Anda"
            labelField="regionName"
            valueField="regionId"
            onChange={(text) => {
              setForm({ ...form, regionId: Number(text) });
              setError((prevError) => ({ ...prevError, regionId: null }));
            }}
            moreStyles="mt-7"
            error={error.regionId}
          />

          <FormField
            label="Alamat Email"
            value={form.email}
            onChangeText={(text) => {
              setForm({ ...form, email: text });
              setError((prevError) => ({ ...prevError, email: null }));
            }}
            keyboardType="email-address"
            moreStyles="mt-7"
            error={error.email}
          />

          <CustomButtonOutline
            label="Ganti Kata Sandi"
            handlePress={handlePasswordChange}
            buttonStyles="mt-8 w-full"
            isLoading={isSubmitting}
            color="brown"
          />

          <CustomButton
            label="Simpan Perubahan"
            handlePress={handleSubmitChange}
            buttonStyles="mt-4 w-full"
            isLoading={isSubmitting}
          />

          {/* <CustomButton
            label="Log Out"
            handlePress={() => signOut()}
            buttonStyles="mt-4"
            isLoading={isSubmitting}
          /> */}
        </View>
      </ScrollView>

      {modalVisible && (
        <ModalAction
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          title="Apakah Anda ingin menyimpan perubahan?"
          primaryButtonLabel="Iya"
          secondaryButtonLabel="Tidak"
          onPrimaryAction={() => {
            handleSaveChanges();
            handleRouteChange();
          }}
          onSecondaryAction={() => {
            handleRouteChange();
          }}
        />
      )}

      {logoutModalVisible && (
        <ModalAction
          setModalVisible={setLogoutModalVisible}
          modalVisible={logoutModalVisible}
          title="Apakah Anda yakin ingin keluar?"
          secondaryButtonLabel="Iya"
          primaryButtonLabel="Tidak"
          onSecondaryAction={() => signOut()}
          onPrimaryAction={() => console.log("Cancel Log Out")}
        />
      )}
    </SafeAreaView>
  );
};

export default EditProfile;
