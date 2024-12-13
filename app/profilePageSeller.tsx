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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import UploadButton from "@/components/UploadButton";
import CustomButton from "@/components/CustomButton";
import CustomButtonOutline from "@/components/CustomButtonOutline";
import * as ImagePicker from "expo-image-picker";
import {
  router,
  Href,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import TextHeader from "@/components/texts/TextHeader";
import { useAuth } from "@/app/context/AuthContext";
import CustomDropdown from "@/components/CustomDropdown";
import paymentApi from "@/api/paymentApi";
import bakeryApi from "@/api/bakeryApi";
import authenticationApi from "@/api/authenticationApi";
import { showToast } from "@/utils/toastUtils";
import { checkEmptyForm, encodeImage } from "@/utils/commonFunctions";
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
import { getLocalStorage, setLocalStorage } from "@/utils/commonFunctions";
import Geocoder from "react-native-geocoding";
import PaymentInput from "@/components/PaymentInput";
import ErrorMessage from "@/components/texts/ErrorMessage";
import { PaymentType } from "@/types/types";
import BackButton from "@/components/BackButton";
import BackButtonWithModal from "@/components/BackButtonModal";

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

type PaymentErrorState = {
  paymentMethod: string | null;
};

interface PaymentMethod {
  method: string;
  serviceOptions?: string[];
}

interface PaymentForm {
  paymentMethods: PaymentType[];
}

const ProfilePageSeller = () => {
  const insets = useSafeAreaInsets();
  const { userData, refreshUserData, signOut } = useAuth();
  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  const [nextRoute, setNextRoute] = useState<Href | null>(null);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTabVisible, setModalTabVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<number>(1);

  const [isUserImageUpdated, setIsUserImageUpdated] = useState(false);
  const [isBakeryImageUpdated, setIsBakeryImageUpdated] = useState(false);
  const [isPaymentQrisUpdated, setIsPaymentQrisUpdated] = useState(false);

  useEffect(() => {
    const loadStoredStatus = async () => {
      const storedStatus = await getLocalStorage("selectedStatusProfile");
      if (storedStatus) {
        setSelectedStatus(Number(storedStatus));
      }
    };
    loadStoredStatus();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setSelectedStatus(1);
      setLocalStorage("selectedStatusProfile", "1");
    }, [])
  );

  const handleRouteChange = async () => {
    if (selectedStatus !== null) {
      await setLocalStorage("selectedStatusProfile", String(selectedStatus));
    }
    Keyboard.dismiss();

    if (nextRoute) {
      router.push(nextRoute);
      setNextRoute(null);
    }
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (selectedStatus === 1) {
      if (!result.canceled) {
        setIsUserImageUpdated(true);
        setForm({ ...form, userImage: result.assets[0].uri });
      }
    } else if (selectedStatus === 2) {
      if (!result.canceled) {
        setIsBakeryImageUpdated(true);
        setBakeryForm({ ...bakeryForm, bakeryImage: result.assets[0].uri });
      }
    } else if (selectedStatus === 3) {
      if (!result.canceled) {
        setIsPaymentQrisUpdated(true);
        setPaymentForm((prevPaymentForm) => {
          const updatedPaymentMethods = prevPaymentForm.paymentMethods.map(
            (method) => {
              if (method.paymentMethod === "QRIS") {
                return { ...method, paymentDetail: result.assets[0].uri };
              }
              return method;
            }
          );

          return { ...prevPaymentForm, paymentMethods: updatedPaymentMethods };
        });
      }
    }
  };

  const [form, setForm] = useState({
    userName: '',
    userPhoneNumber: '',
    userImage: '' as string | undefined,
    roleId: 2,
  });

  const [bakeryForm, setBakeryForm] = useState({
    bakeryName: '',
    bakeryImage: '' as string | undefined,
    bakeryDescription: '',
    bakeryPhoneNumber: '',
    openingTime: '',
    closingTime: '',
    bakeryAddress: '',
    bakeryLatitude: 0,
    bakeryLongitude: 0,
  });

  const [paymentForm, setPaymentForm] = useState({
    paymentMethods: [
      {
        paymentId: 0,
        bakeryId: 0,
        paymentMethod: '',
        paymentService: '',
        paymentDetail: '',
      },
    ],
  });

  useEffect(() => {
    setForm({
      userName: userData?.userName || '',
      userPhoneNumber: userData?.userPhoneNumber || '',
      userImage: userData?.userImage || '',
      roleId: 2,
    });

    setBakeryForm({
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

    setPaymentForm({
      paymentMethods:
        userData?.bakery?.payment?.map((payment: any) => ({
          paymentId: payment.paymentId || 0,
          bakeryId: payment.bakeryId || 0,
          paymentMethod: payment.paymentMethod || "",
          paymentService: payment.paymentService || "",
          paymentDetail: payment.paymentDetail || "",
        })) || [],
    });

    const defaultSelectedMethods = userData?.bakery?.payment?.map((method) => method.paymentMethod) || [];
    setSelectedMethods(defaultSelectedMethods);
    setHasAutoSelected(true);
  }, [userData]);

  console.log("FORM", JSON.stringify(paymentForm, null, 2));


  const emptyError: ErrorState = {
    userName: null,
    userPhoneNumber: null,
  };

  const [error, setError] = useState<ErrorState>(emptyError);

  const handlePasswordChange = () => {
    if (hasUnsavedChanges()) {
      setNextRoute("/changePassword" as Href);
      setModalVisible(true);
    } else {
      router.push("/changePassword" as Href);
    }
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

  const [bakeryError, setBakeryError] =
    useState<BakeryErrorState>(emptyBakeryError);

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

  const [address, setAddress] = useState(userData?.bakery.bakeryAddress || "");
  const [suggestions, setSuggestions] = useState([]);
  const handleGeocoding = (address: string) => {
    Geocoder.from(address)
      .then((json) => {
        const location = json.results[0].geometry.location;
        setBakeryForm({
          ...bakeryForm,
          bakeryLatitude: location.lat,
          bakeryLongitude: location.lng,
          bakeryAddress: address,
        });
      })
      .catch((error) => console.warn(error));
  };

  const handleGetLocationSuggestionsAPI = () => {
    if (address === "") {
      setError((prevError) => ({
        ...prevError,
        address: "Alamat toko tidak boleh kosong",
      }));
      return;
    }

    axios
      .get("https://maps.googleapis.com/maps/api/place/autocomplete/json", {
        params: {
          input: address,
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
    setAddress(item.description);
    setSuggestions([]);
    handleGeocoding(item.description);
  };

  const paymentMethods: PaymentMethod[] = [
    {
      method: "Transfer Bank",
      serviceOptions: ["BCA", "Mandiri", "BNI", "BRI"],
    },
    { method: "E-Wallet", serviceOptions: ["Gopay", "Dana", "OVO"] },
    { method: "QRIS" },
  ];

  const paymentEmptyError: PaymentErrorState = {
    paymentMethod: null,
  };
  const [paymentError, setPaymentError] =
    useState<PaymentErrorState>(paymentEmptyError);

  const { prevPaymentForm } = useLocalSearchParams();
  const parsedPrevForm =
    prevPaymentForm && typeof prevPaymentForm === "string"
      ? JSON.parse(prevPaymentForm)
      : {};

  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const [isDisabledUser, setIsDisabledUser] = useState(false);
  const [isDisabledBakery, setIsDisabledBakery] = useState(false);
  const [isDisabledPayment, setIsDisabledPayment] = useState(false);

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentError((prevPaymentError) => ({
      ...prevPaymentError,
      paymentMethod: null,
    }));

    const updatedMethods = selectedMethods.includes(method)
      ? selectedMethods.filter((m) => m !== method)
      : [...selectedMethods, method];

    setSelectedMethods(updatedMethods);

    setPaymentForm((prevPaymentForm) => {
      const existingMethods = prevPaymentForm.paymentMethods || [];

      const updatedMethodsList = updatedMethods.map((method) => {
        if (method === "QRIS") {
          const existingQRIS = existingMethods.find(
            (entry) => entry.paymentMethod === "QRIS"
          );
          return (
            existingQRIS || {
              paymentId: 0,
              bakeryId: 0,
              paymentMethod: "QRIS",
              paymentService: "QRIS",
              paymentDetail: "",
            }
          );
        }

        const existingMethod = existingMethods.find(
          (entry) => entry.paymentMethod === method
        );
        return (
          existingMethod || {
            paymentId: 0,
            bakeryId: 0,
            paymentMethod: method,
            paymentService: "",
            paymentDetail: "",
          }
        );
      });

      return { ...prevPaymentForm, paymentMethods: updatedMethodsList };
    });
  };

  const handleDropdownSelect = (method: string, service: string) => {
    setPaymentForm((prevPaymentForm) => {
      const updatedMethods = (prevPaymentForm.paymentMethods || []).map(
        (entry) =>
          entry.paymentMethod === method
            ? { ...entry, paymentService: service }
            : entry
      );

      return { ...prevPaymentForm, paymentMethods: updatedMethods };
    });
  };

  const handleTextChange = (method: string, detail: string) => {
    setPaymentForm((prevPaymentForm) => {
      const updatedMethods = prevPaymentForm.paymentMethods.map(
        (payment: any) =>
          payment.paymentMethod === method
            ? { ...payment, paymentDetail: detail }
            : payment
      );
      return {
        ...prevPaymentForm,
        paymentMethods: updatedMethods,
      };
    });
  };

  useEffect(() => {
    setPaymentForm((prevPaymentForm) => ({
      ...prevPaymentForm,
      ...parsedPrevForm,
      roleId: parseInt(parsedPrevForm.roleId),
    }));
  }, [prevPaymentForm]);

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

  const hasPaymentUnsavedChanges = () => {
    const formPaymentIds = (paymentForm.paymentMethods || []).map(
      (method) => method.paymentId
    );
    const userPaymentIds = (userData?.bakery?.payment || []).map(
      (method) => method.paymentId
    );

    if (formPaymentIds.length !== userPaymentIds.length) {
      return true;
    }

    return (
      !formPaymentIds.every((id) => userPaymentIds.includes(id)) ||
      (paymentForm.paymentMethods || []).some((method, index) => {
        const userPaymentMethod = userData?.bakery?.payment?.[index];
        return (
          method.paymentMethod !== userPaymentMethod?.paymentMethod ||
          method.paymentService !== userPaymentMethod?.paymentService ||
          method.paymentDetail !== userPaymentMethod?.paymentDetail
        );
      })
    );
  };

  const handleSubmitChange = () => {
    if (selectedStatus === 1) {
      const errors = checkEmptyForm(form);
      if (Object.values(errors).some((error) => error !== null)) {
        setError(errors as ErrorState);
        setisSubmitting(false);
        return;
      }
    } else if (selectedStatus === 2) {
      const errors = checkEmptyForm(bakeryForm);
      if (Object.values(errors).some((error) => error !== null)) {
        setBakeryError(errors as BakeryErrorState);
        setisSubmitting(false);
        return;
      }
    } else if (selectedStatus === 3) {
      if (paymentForm.paymentMethods.length === 0) {
        setPaymentError((prevPaymentError) => ({
          ...prevPaymentError,
          paymentMethod: "Silakan pilih minimal 1 metode pembayaran",
        }));
        return;
      }

      if (
        paymentForm.paymentMethods.some(
          (method) => !method.paymentService || !method.paymentDetail
        )
      ) {
        const incompleteMethods = paymentForm.paymentMethods.filter(
          (method) => !method.paymentService || !method.paymentDetail
        );

        const errorMessage = incompleteMethods
          .map((method) => method.paymentMethod)
          .join(", ");

        setPaymentError((prevPaymentError) => ({
          ...prevPaymentError,
          paymentMethod: `Silakan lengkapi detail untuk metode pembayaran: ${errorMessage}`,
        }));
        return;
      }

      setPaymentError((prevPaymentError) => ({
        ...prevPaymentError,
        paymentMethod: null,
      }));
    }

    if (
      hasUnsavedChanges() ||
      hasBakeryUnsavedChanges() ||
      hasPaymentUnsavedChanges()
    ) {
      setModalVisible(true);
    } else {
      router.push("/profilePageSeller" as Href);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setisSubmitting(true);

      let userFormData = null;
      if (isUserImageUpdated && form.userImage) {
        const encodedUserImage = await encodeImage(form.userImage);
        if (encodedUserImage) {
          userFormData = {
            ...form,
            userImage: encodedUserImage,
          };
        }
      } else {
        userFormData = {
          ...form,
          userImage: isUserImageUpdated ? form.userImage : undefined,
        }
      }

      if (selectedStatus === 1) {
        const response = await authenticationApi().updateUser({
          ...userFormData,
          userId: userData?.userId,
        });

        if (response.status === 200) {
          showToast("success", "Data pengguna berhasil diperbarui");
          setIsUserImageUpdated(false);
        }
      } else if (selectedStatus === 2) {

        let bakeryFormData = null;
        if (isBakeryImageUpdated && bakeryForm.bakeryImage) {
          const encodedBakeryImage = await encodeImage(bakeryForm.bakeryImage);
          if (encodedBakeryImage) {
            bakeryFormData = {
              ...bakeryForm,
              bakeryImage: encodedBakeryImage,
            };
          }
        } else {
          bakeryFormData = {
            ...bakeryForm,
            bakeryImage: isBakeryImageUpdated ? bakeryForm.bakeryImage : undefined,
          }
        }

        const response = await bakeryApi().updateBakery({
          ...bakeryFormData,
          bakeryId: userData?.bakery.bakeryId,
        });

        if (response.status === 200) {
          showToast("success", "Data bakeri berhasil diperbarui");
          setIsBakeryImageUpdated(false);
        }
      } else if (selectedStatus === 3) {
        let encodedQrisImage: string | null = null;
        const qrisMethod = paymentForm.paymentMethods.find((method) => method.paymentMethod === 'QRIS');

        if (qrisMethod) {
          encodedQrisImage = await encodeImage(qrisMethod.paymentDetail);
          if (encodedQrisImage) {
            qrisMethod.paymentDetail = encodedQrisImage;
          }
        }

        const paymentUpdates = paymentForm.paymentMethods.map((payment) => ({
          paymentId: payment.paymentId,
          bakeryId: userData?.bakery.bakeryId,
          paymentMethod: payment.paymentMethod,
          paymentService: payment.paymentService,
          paymentDetail: payment.paymentDetail.trim(),
        }));

        const response = await paymentApi().updatePayments(paymentUpdates);

        if (response.status === 200) {
          showToast("success", "Data pembayaran berhasil diperbarui");
          setIsPaymentQrisUpdated(false);
        }
      }

      const paymentDatabase = await paymentApi().getPaymentByBakery({
        bakeryId: userData?.bakery.bakeryId,
      });

      const paymentData: PaymentType[] = paymentDatabase?.data || [];

      const userDataToStore = {
        ...form,
        userId: userData?.userId,
        bakery: {
          ...bakeryForm,
          bakeryId: userData?.bakery.bakeryId,
          payment: paymentData.map((payment) => ({
            paymentId: payment.paymentId,
            bakeryId: payment.bakeryId,
            paymentMethod: payment.paymentMethod,
            paymentService: payment.paymentService,
            paymentDetail: payment.paymentDetail,
          })),
        },
      };

      await SecureStore.setItemAsync(
        "userData",
        JSON.stringify(userDataToStore)
      );

      await refreshUserData();
      handleRouteChange();
    } catch (error) {
      console.log(error);
      showToast("error", "An unexpected error occurred");
    } finally {
      setisSubmitting(false);
    }
  };

  useEffect(() => {
    setIsDisabledUser(!hasUnsavedChanges());
  }, [form, userData]);

  useEffect(() => {
    setIsDisabledBakery(!hasBakeryUnsavedChanges());
  }, [bakeryForm, userData]);

  useEffect(() => {
    setIsDisabledPayment(!hasPaymentUnsavedChanges());
  }, [paymentForm, userData]);

  const resetForms = () => {
    setForm({
      userName: userData?.userName || "",
      userPhoneNumber: userData?.userPhoneNumber || "",
      userImage: userData?.userImage || "",
      roleId: 2,
    });

    setBakeryForm({
      bakeryName: userData?.bakery?.bakeryName || "",
      bakeryImage: userData?.bakery?.bakeryImage || "",
      bakeryDescription: userData?.bakery?.bakeryDescription || "",
      bakeryPhoneNumber: userData?.bakery?.bakeryPhoneNumber || "",
      openingTime: userData?.bakery?.openingTime || "",
      closingTime: userData?.bakery?.closingTime || "",
      bakeryAddress: userData?.bakery?.bakeryAddress || "",
      bakeryLatitude: userData?.bakery?.bakeryLatitude || 0,
      bakeryLongitude: userData?.bakery?.bakeryLongitude || 0,
    });

    setPaymentForm({
      paymentMethods:
        userData?.bakery?.payment?.map((payment: any) => ({
          paymentId: payment.paymentId || 0,
          bakeryId: payment.bakeryId || 0,
          paymentMethod: payment.paymentMethod || "",
          paymentService: payment.paymentService || "",
          paymentDetail: payment.paymentDetail || "",
        })) || [],
    });
  };

  const [tempStatus, setTempStatus] = useState<number>(0);

  const handleStatusChange = (status: number) => {
    let unsavedChanges: boolean;
    unsavedChanges = hasUnsavedChanges() || hasBakeryUnsavedChanges() || hasPaymentUnsavedChanges();
    if (unsavedChanges) {
      setTempStatus(status);
      setModalTabVisible(true);
    } else {
      setSelectedStatus(status);
      setLocalStorage("selectedStatusProfile", String(status));
      resetForms();
    }
  };

  const handleNavigateStatus = () => {
    if (tempStatus !== null) {
      setSelectedStatus(tempStatus);
      setLocalStorage("selectedStatusProfile", String(tempStatus));
    }
    setTempStatus(0);
    resetForms();
    setModalTabVisible(false);
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
          path="/(tabsSeller)/home"
          hasUnsavedChanges={
            selectedStatus === 1
              ? () => hasUnsavedChanges()
              : selectedStatus === 2
                ? () => hasBakeryUnsavedChanges()
                : selectedStatus === 3
                  ? () => hasPaymentUnsavedChanges()
                  : () => false
          }
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

      <View className="mx-5">
        <ProfileTab
          selectedStatus={modalTabVisible ? tempStatus : selectedStatus}
          onSelectStatus={handleStatusChange}
        />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        <View style={{ paddingHorizontal: 20, flex: 1, paddingTop: 20 }}>
          <View className="w-full items-center" style={{ marginTop: 20 }}>
            {selectedStatus === 1 ? (
              <>
                <View className="w-24 h-24 border border-gray-200 rounded-full mb-4">
                  <Image
                    source={isUserImageUpdated ? { uri: form.userImage } : { uri: `${process.env.EXPO_PUBLIC_LOCAL_SERVER}/images/profile/${form.userImage}` }}
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
                  buttonStyles="my-3 w-full"
                  isLoading={isSubmitting}
                  disabled={isDisabledUser}
                />
              </>
            ) : selectedStatus === 2 ? (
              <>
                <View className="w-24 h-24 border border-gray-200 rounded-full mb-4">
                  <Image
                    source={isBakeryImageUpdated ? { uri: bakeryForm.bakeryImage } : { uri: `${process.env.EXPO_PUBLIC_LOCAL_SERVER}/images/bakery-image/${bakeryForm.bakeryImage}` }}
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
                  label="Alamat Toko"
                  value={address}
                  placeholder="Cari lokasi toko Anda"
                  onChangeText={(text) => {
                    setAddress(text);
                    setError((prevError) => ({
                      ...prevError,
                      bakeryAddress: null,
                    }));
                  }}
                  moreStyles="mt-7"
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
                  buttonStyles="mt-10 mb-5 w-full"
                  isLoading={isSubmitting}
                  disabled={isDisabledBakery}
                />

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="time"
                  onConfirm={handleSelectTime}
                  onCancel={hideDatePicker}
                />
              </>
            ) : (
              <>
                <View className="w-full">
                  <PaymentInput
                    paymentMethods={paymentMethods}
                    selectedMethods={selectedMethods}
                    form={paymentForm.paymentMethods || []}
                    selectMethod={handlePaymentMethodSelect}
                    selectDropdown={handleDropdownSelect}
                    onChangeText={handleTextChange}
                    pickImage={pickImage}
                    isLoadQris={isPaymentQrisUpdated}
                  />
                </View>
                {paymentError.paymentMethod && (
                  <ErrorMessage label={paymentError.paymentMethod} />
                )}
                <CustomButton
                  label="Simpan Perubahan"
                  handlePress={handleSubmitChange}
                  buttonStyles="mt-10 w-full"
                  isLoading={isSubmitting}
                  disabled={isDisabledPayment}
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

      {modalTabVisible && (
        <ModalAction
          setModalVisible={setModalTabVisible}
          modalVisible={modalTabVisible}
          title="Anda memiliki perubahan yang belum disimpan"
          primaryButtonLabel="Lanjutkan"
          secondaryButtonLabel="Keluar"
          onPrimaryAction={() => {
            setModalTabVisible(false);
          }}
          onSecondaryAction={() => {
            resetForms();
            handleNavigateStatus();
            resetForms();
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

export default ProfilePageSeller;
