import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  Alert,
  TouchableOpacity,
  Keyboard
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import UploadButton from "@/components/UploadButton";
import CustomButton from "@/components/CustomButton";
import CustomButtonOutline from "@/components/CustomButtonOutline";
import * as ImagePicker from "expo-image-picker";
import { router, Href } from "expo-router";
import TextHeader from "@/components/texts/TextHeader";
import { useAuth } from "@/app/context/AuthContext";
import CustomDropdown from "@/components/CustomDropdown";
import authenticationApi from "@/api/authenticationApi";
import { showToast } from "@/utils/toastUtils";
import { checkEmptyForm } from "@/utils/commonFunctions";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import ModalAction from "@/components/ModalAction";
import Toast from "react-native-toast-message";
import InputLocationField from "@/components/InputLocationField";
import axios from "axios";
import Geocoder from 'react-native-geocoding';

type ErrorState = {
  userName: string | null;
  userPhoneNumber: string | null;
  address: string | null;
};

const ProfilePage = () => {
  const insets = useSafeAreaInsets();
  const { userData, refreshUserData, signOut } = useAuth();
  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string

  const [form, setForm] = useState({
    userName: userData?.userName || "",
    userPhoneNumber: userData?.userPhoneNumber || "",
    email: userData?.email || "",
    userImage: userData?.userImage || "",
    address: userData?.address || "",
    latitude: userData?.latitude || 0,
    longitude: userData?.longitude || 0,
    roleId: 1,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

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
      router.replace("/(tabsCustomer)/profile/profilePage" as Href);
    }
    Keyboard.dismiss();
  };

  const handlePasswordChange = () => {
    if (hasUnsavedChanges()) {
      setNextRoute("/(tabsCustomer)/profile/changePassword");
      setModalVisible(true);
    } else {
      router.push("/(tabsCustomer)/profile/changePassword");
    }
  };

  const handleSubmitChange = () => {
    if (hasUnsavedChanges()) {
      setNextRoute("/(tabsCustomer)/profile/profilePage" as Href);
      setModalVisible(true);
    } else {
      router.push("/(tabsCustomer)/profile/profilePage" as Href);
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
        address: form.address,
        latitude: form.latitude,
        longitude: form.longitude
      });

      const userDataToStore = {
        ...form,
        userId: userData?.userId
      };

      await SecureStore.setItemAsync(
        "userData",
        JSON.stringify(userDataToStore)
      );

      console.log(JSON.stringify(userDataToStore));

      await refreshUserData();

    } catch (error) {
      console.log(error);
      showToast("error", "An unexpected error occurred");
    } finally {
      setisSubmitting(false);
    }
  };

  const [userAddress, setUserAddress] = useState(userData?.address || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isSubmitting, setisSubmitting] = useState(false);

  const handleGeocoding = (address: string) => {
    Geocoder.from(address)
      .then(json => {
        const location = json.results[0].geometry.location;
        setForm({ ...form, latitude: location.lat, longitude: location.lng, address: address });
      })
      .catch(error => console.warn(error));
  }

  const handleGetLocationSuggestionsAPI = () => {

    if (userAddress === '') {
      setError((prevError) => ({ ...prevError, address: 'Alamat tidak boleh kosong' }));
      return;
    }

    axios
      .get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
        params: {
          input: userAddress,
          key: GOOGLE_MAPS_API_KEY,
          language: 'id',
          location: '-6.222941492431385, 106.64889532527259',
          radius: 5000,
          types: 'establishment',
        },
      })
      .then(response => {
        setSuggestions(response.data.predictions);
      })
      .catch(error => console.error(error));
  };

  const handleSelectSuggestion = (item: any) => {
    setUserAddress(item.description);
    setSuggestions([]);
    handleGeocoding(item.description);
  };

  console.log("Form", JSON.stringify(form, null, 2));

  return (
    <View className="bg-background h-full flex-1">

      <View
        style={{
          backgroundColor: "#FEFAF9",
          height: insets.top,
        }}
      />

      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <Toast topOffset={50} />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          marginBottom: 20,
          position: "relative",
        }}
      >
        <TextHeader label="Profil Saya" />

        <TouchableOpacity
          style={{ position: "absolute", right: 20 }}
          onPress={() => setLogoutModalVisible(true)}
        >
          <Ionicons name="log-out-outline" size={24} color="#b0795a" />
        </TouchableOpacity>
      </View>


      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>

        <View style={{ paddingHorizontal: 20, flex: 1 }}>

          <View className="w-full items-center">
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
          <InputLocationField
            label='Alamat'
            value={userAddress}
            placeholder='Cari lokasi Anda'
            onChangeText={(text) => {
              setUserAddress(text);
              setError((prevError) => ({ ...prevError, address: null }));
            }}
            moreStyles='mt-7'
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

export default ProfilePage;
