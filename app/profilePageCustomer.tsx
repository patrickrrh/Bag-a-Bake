import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  Alert,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import UploadButton from "@/components/UploadButton";
import CustomButton from "@/components/CustomButton";
import CustomButtonOutline from "@/components/CustomButtonOutline";
import * as ImagePicker from "expo-image-picker";
import { router, Href, useFocusEffect } from "expo-router";
import TextHeader from "@/components/texts/TextHeader";
import { useAuth } from "@/app/context/AuthContext";
import CustomDropdown from "@/components/CustomDropdown";
import authenticationApi from "@/api/authenticationApi";
import { showToast } from "@/utils/toastUtils";
import { checkEmptyForm, encodeImage } from "@/utils/commonFunctions";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import ModalAction from "@/components/ModalAction";
import Toast from "react-native-toast-message";
import InputLocationField from "@/components/InputLocationField";
import axios from "axios";
import Geocoder from "react-native-geocoding";
import BackButton from "@/components/BackButton";
import BackButtonWithModal from "@/components/BackButtonModal";
import * as FileSystem from 'expo-file-system';
import { images } from "@/constants/images";

type ErrorState = {
  userName: string | null;
  userPhoneNumber: string | null;
  address: string | null;
};

const ProfilePageCustomer = () => {
  const insets = useSafeAreaInsets();
  const { userData, refreshUserData, signOut } = useAuth();
  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string;
  const [isDisabled, setIsDisabled] = useState(false);

  const [form, setForm] = useState({
    userName: '',
    userPhoneNumber: '',
    email: '',
    userImage: '' as string | undefined,
    address: '',
    latitude: 0,
    longitude: 0,
    roleId: 1,
  });

  useEffect(() => {
    setForm({
      userName: userData?.userName || '',
      userPhoneNumber: userData?.userPhoneNumber || '',
      email: userData?.email || '',
      userImage: userData?.userImage || '',
      address: userData?.address || '',
      latitude: userData?.latitude || 0,
      longitude: userData?.longitude || 0,
      roleId: 1,
    });
  }, [userData]);

  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isImageUpdated, setIsImageUpdated] = useState(false);

  const emptyError: ErrorState = {
    userName: null,
    userPhoneNumber: null,
    address: null,
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
      setIsImageUpdated(true);
      setForm({ ...form, userImage: result.assets[0].uri });
    }
  };

  const hasUnsavedChanges = () => {
    return (
      form.userName !== userData?.userName ||
      form.userPhoneNumber !== userData?.userPhoneNumber ||
      form.email !== userData?.email ||
      form.userImage !== userData?.userImage ||
      form.address !== userData?.address
    );
  };

  const [nextRoute, setNextRoute] = useState<Href | null>(null);
  const handleRouteChange = () => {
    if (nextRoute) {
      router.push(nextRoute);
    } else {
      router.replace("/(tabsCustomer)/profile" as Href);
    }
    Keyboard.dismiss();
  };

  const handlePasswordChange = () => {
    if (hasUnsavedChanges()) {
      setNextRoute("/changePassword");
      setModalVisible(true);
    } else {
      router.push("/changePassword");
    }
  };

  const handleSubmitChange = () => {
    if (hasUnsavedChanges()) {
      setNextRoute("/profilePageCustomer" as Href);
      setModalVisible(true);
    } else {
      router.push("/profilePageCustomer" as Href);
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

      let formData = null;
      if (isImageUpdated && form.userImage) {
        const encodedUserImage = await encodeImage(form.userImage);
        if (encodedUserImage) {
          formData = {
            ...form,
            userImage: encodedUserImage,
          };
        }
      } else {
        formData = {
          ...form,
          userImage: isImageUpdated ? form.userImage : undefined,
        }
      }

      await authenticationApi().updateUser({
        ...formData,
        userId: userData?.userId,
      });

      showToast("success", "Data pengguna berhasil diperbarui");

      await refreshUserData();
    } catch (error) {
      console.log(error);
      showToast("error", "An unexpected error occurred");
    } finally {
      setisSubmitting(false);
      setIsImageUpdated(false);
    }
  };

  const [userAddress, setUserAddress] = useState(userData?.address || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isSubmitting, setisSubmitting] = useState(false);

  useEffect(() => {
    setIsDisabled(!hasUnsavedChanges());
  }, [form, userData]);

  const handleGeocoding = (address: string) => {
    Geocoder.from(address)
      .then((json) => {
        const location = json.results[0].geometry.location;
        setForm({
          ...form,
          latitude: location.lat,
          longitude: location.lng,
          address: address,
        });
      })
      .catch((error) => console.warn(error));
  };

  const handleGetLocationSuggestionsAPI = () => {
    if (userAddress === "") {
      setError((prevError) => ({
        ...prevError,
        address: "Alamat tidak boleh kosong",
      }));
      return;
    }

    axios
      .get("https://maps.googleapis.com/maps/api/place/autocomplete/json", {
        params: {
          input: userAddress,
          key: GOOGLE_MAPS_API_KEY,
          language: "id",
          location: "-6.222941492431385, 106.64889532527259",
          radius: 5000,
          types: "establishment",
        },
      })
      .then((response) => {
        setSuggestions(response.data.predictions);
      })
      .catch((error) => console.error(error));
  };

  const handleSelectSuggestion = (item: any) => {
    setUserAddress(item.description);
    setSuggestions([]);
    handleGeocoding(item.description);
  };

  return (
    <View className="bg-background h-full flex-1">
      <View
        style={{
          backgroundColor: "#FEFAF9",
          height: insets.top,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <BackButtonWithModal
          path="/(tabsCustomer)"
          hasUnsavedChanges={hasUnsavedChanges}
        />

        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <TextHeader label="Profil Saya" />
        </View>

        <TouchableOpacity onPress={() => setLogoutModalVisible(true)}>
          <Ionicons name="log-out-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        <View style={{ paddingHorizontal: 20, flex: 1, paddingTop: 20 }}>
          <View className="w-full items-center">
            <View className="w-24 h-24 border border-gray-200 rounded-full mb-4">
              <Image
                source={isImageUpdated ? { uri: form.userImage } : { uri: `${process.env.EXPO_PUBLIC_LOCAL_SERVER}/images/profile/${form.userImage}` }}
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
          <InputLocationField
            label="Alamat"
            value={userAddress}
            placeholder="Cari lokasi Anda"
            onChangeText={(text) => {
              setUserAddress(text);
              setError((prevError) => ({ ...prevError, address: null }));
            }}
            moreStyles="mt-7"
            suggestions={suggestions}
            error={error.address}
            onSearch={() => handleGetLocationSuggestionsAPI()}
            onSelectSuggestion={handleSelectSuggestion}
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

          <CustomButtonOutline
            label="Ganti Kata Sandi"
            handlePress={handlePasswordChange}
            buttonStyles="mt-8"
            isLoading={isSubmitting}
            color="#b0795a"
          />

          <CustomButton
            label="Simpan Perubahan"
            handlePress={handleSubmitChange}
            buttonStyles="mt-3"
            isLoading={isSubmitting}
            disabled={isDisabled}
          />
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
    </View>
  );
};

export default ProfilePageCustomer;
