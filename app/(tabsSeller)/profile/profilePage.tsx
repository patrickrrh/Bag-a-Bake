import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import UploadButton from "@/components/UploadButton";
import CustomButton from "@/components/CustomButton";
import CustomButtonOutline from "@/components/CustomButtonOutline";
import * as ImagePicker from "expo-image-picker";
import { router, Href, useFocusEffect } from "expo-router";
import TextHeader from "@/components/texts/TextHeader";
import { useAuth } from "@/app/context/AuthContext";
import CustomDropdown from "@/components/CustomDropdown";
import regionApi from "@/api/regionApi";
import bakeryApi from "@/api/bakeryApi";
import authenticationApi from "@/api/authenticationApi";
import { showToast } from "@/utils/toastUtils";
import { checkEmptyForm } from "@/utils/commonFunctions";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import ModalAction from "@/components/ModalAction";
import ProfileTab from "@/components/ProfileTab";
import TextTitle3 from "@/components/texts/TextTitle3";
import TextAreaField from "@/components/TextAreaField";
import TimeField from "@/components/TimeField";
import { format, toZonedTime } from "date-fns-tz";
import Toast from "react-native-toast-message";
import InputLocationField from "@/components/InputLocationField";
import axios from "axios";
import Geocoder from 'react-native-geocoding';

type ErrorState = {
  userName: string | null;
  userPhoneNumber: string | null;
};

type BakeryErrorState = {
  bakeryName: string | null;
  bakeryImage: string | null;
  bakeryDescription: string | null;
  bakeryPhoneNumber: string | null;
  openingTime: string | null;
  closingTime: string | null;
  bakeryAddress: string | null;
  bakeryLatitude: number | null;
  bakeryLongitude: number | null;
};

const EditProfile = () => {
  const { userData, refreshUserData, signOut } = useAuth();
  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string

  const [form, setForm] = useState({
    userName: userData?.userName || "",
    userPhoneNumber: userData?.userPhoneNumber || "",
    userImage: userData?.userImage || "",
    roleId: 2,
  });

  const [bakeryForm, setBakeryForm] = useState({
    bakeryName: userData?.bakery.bakeryName || "",
    bakeryImage: userData?.bakery.bakeryImage || "",
    bakeryDescription: userData?.bakery.bakeryDescription || "",
    bakeryPhoneNumber: userData?.bakery.bakeryPhoneNumber || "",
    openingTime: userData?.bakery.openingTime || "",
    closingTime: userData?.bakery.closingTime || "",
    bakeryAddress: userData?.bakery.bakeryAddress || "",
    bakeryLatitude: userData?.bakery.bakeryLatitude || 0,
    bakeryLongitude: userData?.bakery.bakeryLongitude || 0,
  });

  const [selectedStatus, setSelectedStatus] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const emptyError: ErrorState = {
    userName: null,
    userPhoneNumber: null,
  };
  const emptyBakeryError: BakeryErrorState = {
    bakeryName: null,
    bakeryImage: null,
    bakeryDescription: null,
    bakeryPhoneNumber: null,
    openingTime: null,
    closingTime: null,
    bakeryAddress: null,
    bakeryLatitude: null,
    bakeryLongitude: null,
  };
  const [error, setError] = useState<ErrorState>(emptyError);
  const [bakeryError, setBakeryError] = useState<BakeryErrorState>(emptyBakeryError);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (selectedStatus === 1) {
      if (!result.canceled) {
        setForm({ ...form, userImage: result.assets[0].uri });
      }
    } else {
      if (!result.canceled) {
        setBakeryForm({ ...bakeryForm, bakeryImage: result.assets[0].uri });
      }
    }
  };

  const hasUnsavedChanges = () => {
    return (
      form.userName !== userData?.userName ||
      form.userPhoneNumber !== userData?.userPhoneNumber ||
      form.userImage !== userData?.userImage
    );
  };

  const hasBakeryUnsavedChanges = () => {
    return (
      bakeryForm.bakeryName !== userData?.bakery.bakeryName ||
      bakeryForm.bakeryImage !== userData?.bakery.bakeryImage ||
      bakeryForm.bakeryDescription !== userData?.bakery.bakeryDescription ||
      bakeryForm.bakeryPhoneNumber !== userData?.bakery.bakeryPhoneNumber ||
      bakeryForm.openingTime !== userData?.bakery.openingTime ||
      bakeryForm.closingTime !== userData?.bakery.closingTime ||
      bakeryForm.bakeryAddress !== userData?.bakery.bakeryAddress ||
      bakeryForm.bakeryLatitude !== userData?.bakery.bakeryLatitude ||
      bakeryForm.bakeryLongitude !== userData?.bakery.bakeryLongitude
    );
  };

  const [nextRoute, setNextRoute] = useState<Href | null>(null);
  const handleRouteChange = () => {
    if (nextRoute) {
      router.push(nextRoute);
    } else {
      router.replace("/(tabsSeller)/profile");
    }
  };

  const handlePasswordChange = () => {
    if (hasUnsavedChanges()) {
      setNextRoute("/(tabsSeller)/profile/changePassword");
      setModalVisible(true);
    } else {
      router.push("/(tabsSeller)/profile/changePassword");
    }
  };

  const handleSubmitChange = () => {
    if (hasUnsavedChanges() || hasBakeryUnsavedChanges()) {
      setNextRoute("/(tabsSeller)/profile");
      setModalVisible(true);
    } else {
      router.push("/(tabsSeller)/profile");
    }
  };

  // const handleSaveChanges = async () => {
  //   try {
  //     setisSubmitting(true);

  //     const errors = checkEmptyForm(form);
  //     if (Object.values(errors).some((error) => error !== null)) {
  //       setError(errors as ErrorState);
  //       return;
  //     }

  //     await authenticationApi().updateUser({
  //       userId: userData?.userId,
  //       userName: form.userName,
  //       userPhoneNumber: form.userPhoneNumber,
  //       email: form.email,
  //       userImage: form.userImage,
  //       regionId: form.regionId,
  //     });
  //     console.log(form);
  //     console.log(userData?.userId);

  //     const userDataToStore = {
  //       ...form,
  //       userId: userData?.userId,
  //     };

  //     await SecureStore.setItemAsync(
  //       "userData",
  //       JSON.stringify(userDataToStore)
  //     );

  //     await refreshUserData();

  //     router.replace("/(tabsSeller)/profile");
  //   } catch (error) {
  //     console.log(error);
  //     showToast("error", "An unexpected error occurred");
  //   } finally {
  //     setisSubmitting(false);
  //   }
  // };

  const handleSaveChanges = async () => {
    try {
      setisSubmitting(true);

      if (selectedStatus === 1) {
        const errors = checkEmptyForm(form);
        if (Object.values(errors).some((error) => error !== null)) {
          setError(errors as ErrorState);
          return;
        }

        await authenticationApi().updateUser({
          userId: userData?.userId,
          userName: form.userName,
          userPhoneNumber: form.userPhoneNumber,
          userImage: form.userImage,
        });

        showToast("success", "User data updated successfully!");
      } else if (selectedStatus === 2) {

        await bakeryApi().updateBakery({
          bakeryId: userData?.bakery.bakeryId,
          bakeryName: bakeryForm.bakeryName,
          bakeryImage: bakeryForm.bakeryImage,
          bakeryDescription: bakeryForm.bakeryDescription,
          bakeryPhoneNumber: bakeryForm.bakeryPhoneNumber,
          openingTime: bakeryForm.openingTime,
          closingTime: bakeryForm.closingTime,
          bakeryAddress: bakeryForm.bakeryAddress,
          bakeryLatitude: bakeryForm.bakeryLatitude,
          bakeryLongitude: bakeryForm.bakeryLongitude
        });

        showToast("success", "Bakery Data updated successfully!");
      }

      const userDataToStore = {
        ...form,
        userId: userData?.userId,
        bakery: {
          ...bakeryForm,
          bakeryId: userData?.bakery.bakeryId
        }
      };

      await SecureStore.setItemAsync(
        "userData",
        JSON.stringify(userDataToStore)
      );

      await refreshUserData();
      router.replace("/(tabsSeller)/profile");
    } catch (error) {
      console.log(error);
      showToast("error", "An unexpected error occurred");
    } finally {
      setisSubmitting(false);
    }
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [timeFieldType, setTimeFieldType] = useState<
    "openingTime" | "closingTime"
  >("openingTime");

  const showDatePicker = (type: "openingTime" | "closingTime") => {
    setTimeFieldType(type);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleSelectTime = (time: any) => {
    const timezone = toZonedTime(time, "Asia/Jakarta");
    const formattedTime = format(timezone, "HH:mm");

    if (timeFieldType === "openingTime") {
      setBakeryForm((prevBakeryForm) => ({
        ...prevBakeryForm,
        openingTime: formattedTime,
      }));
      setBakeryError((prevBakeryError) => ({
        ...prevBakeryError,
        openingTime: null,
      }));
    } else {
      setBakeryForm((prevBakeryForm) => ({
        ...prevBakeryForm,
        closingTime: formattedTime,
      }));
      setBakeryError((prevBakeryError) => ({
        ...prevBakeryError,
        closingTime: null,
      }));
    }

    hideDatePicker();
  };

  const [isSubmitting, setisSubmitting] = useState(false);
  const [address, setAddress] = useState(userData?.bakery.bakeryAddress || '');
  const [suggestions, setSuggestions] = useState([]);

  const handleGeocoding = (address: string) => {
    Geocoder.from(address)
      .then(json => {
        const location = json.results[0].geometry.location;
        setBakeryForm({ ...bakeryForm, bakeryLatitude: location.lat, bakeryLongitude: location.lng, bakeryAddress: address });
      })
      .catch(error => console.warn(error));
  }

  const handleGetLocationSuggestionsAPI = () => {

    if (address === '') {
      setError((prevError) => ({ ...prevError, address: 'Alamat toko tidak boleh kosong' }));
      return;
    }

    axios
      .get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
        params: {
          input: address,
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
    setAddress(item.description);
    setSuggestions([]);
    handleGeocoding(item.description);
  };

  console.log("bakery form", JSON.stringify(bakeryForm, null, 2));

  return (
    <SafeAreaView className="bg-background h-full flex-1">

      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <Toast topOffset={50} />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>

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

          <View className="mx-5 mt-6">
            <ProfileTab
              selectedStatus={selectedStatus}
              onSelectStatus={(status) => {
                setSelectedStatus(status);
              }}
            />
          </View>

          <View className="mt-4 w-full items-center" style={{ marginTop: 40 }}>
            {selectedStatus === 1 ? (
              <>
                <View className="w-24 h-24 border border-gray-200 rounded-full mb-4">
                  <Image
                    source={{ uri: form.userImage }}
                    className="w-full h-full rounded-full"
                  />
                </View>
                <UploadButton label="Unggah Foto" handlePress={pickImage} />

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

                <CustomButtonOutline
                  label="Ganti Kata Sandi"
                  handlePress={handlePasswordChange}
                  buttonStyles="mt-10 w-full"
                  isLoading={isSubmitting}
                  color="#b0795a"
                />

                <CustomButton
                  label="Simpan Perubahan"
                  handlePress={handleSubmitChange}
                  buttonStyles="mt-5 w-full"
                  isLoading={isSubmitting}
                />
              </>
            ) : (
              <>
                <View className="w-24 h-24 border border-gray-200 rounded-full mb-4">
                  <Image
                    source={{ uri: bakeryForm.bakeryImage }}
                    className="w-full h-full rounded-full"
                  />
                </View>
                <UploadButton label="Unggah Foto" handlePress={pickImage} />

                <FormField
                  label="Nama Toko"
                  value={bakeryForm.bakeryName}
                  onChangeText={(text) =>
                    setBakeryForm({ ...bakeryForm, bakeryName: text })
                  }
                  moreStyles="mt-7"
                  error={bakeryError.bakeryName}
                />
                <InputLocationField
                  label='Alamat Toko'
                  value={address}
                  placeholder='Cari lokasi toko Anda'
                  onChangeText={(text) => {
                    setAddress(text);
                    setError((prevError) => ({ ...prevError, bakeryAddress: null }));
                  }}
                  moreStyles='mt-7'
                  suggestions={suggestions}
                  error={bakeryError.bakeryAddress}
                  onSearch={() => handleGetLocationSuggestionsAPI()}
                  onSelectSuggestion={handleSelectSuggestion}
                />
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <TimeField
                      label="Jam Buka"
                      value={bakeryForm.openingTime}
                      onPress={() => showDatePicker("openingTime")}
                      error={bakeryError.openingTime}
                      moreStyles="mt-7"
                    />
                  </View>
                  <View className="flex-1">
                    <TimeField
                      label="Jam Tutup"
                      value={bakeryForm.closingTime}
                      onPress={() => showDatePicker("closingTime")}
                      error={bakeryError.closingTime}
                      moreStyles="mt-7"
                    />
                  </View>
                </View>

                <FormField
                  label="Nomor Telepon Toko"
                  value={bakeryForm.bakeryPhoneNumber}
                  onChangeText={(text) => {
                    setBakeryForm((prevBakeryForm) => ({
                      ...prevBakeryForm,
                      bakeryPhoneNumber: text,
                    }));
                    setBakeryError((prevBakeryError) => ({
                      ...prevBakeryError,
                      bakeryPhoneNumber: null,
                    }));
                  }}
                  keyboardType="phone-pad"
                  moreStyles="mt-7"
                  error={bakeryError.bakeryPhoneNumber}
                />
                <TextAreaField
                  label="Deskripsi Toko"
                  value={bakeryForm.bakeryDescription}
                  onChangeText={(text) => {
                    setBakeryForm((prevBakeryForm) => ({
                      ...prevBakeryForm,
                      bakeryDescription: text,
                    }));
                    setBakeryError((prevBakeryError) => ({
                      ...prevBakeryError,
                      bakeryDescription: null,
                    }));
                  }}
                  keyboardType="default"
                  moreStyles="mt-7"
                  error={bakeryError.bakeryDescription}
                />

                <CustomButton
                  label="Simpan Perubahan"
                  handlePress={handleSubmitChange}
                  buttonStyles="mt-10 w-full"
                  isLoading={isSubmitting}
                />

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="time"
                  onConfirm={handleSelectTime}
                  onCancel={hideDatePicker}
                />
              </>
            )}
          </View>
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
