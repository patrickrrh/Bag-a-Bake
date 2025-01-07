import { View, Text, ScrollView, Image, Button, Switch } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomLogo from '@/components/CustomLogo'
import TextHeader from '@/components/texts/TextHeader'
import CustomButton from '@/components/CustomButton'
import ErrorMessage from '@/components/texts/ErrorMessage'
import TextHeadline from '@/components/texts/TextHeadline'
import { Link, router, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import TextLink from '@/components/texts/TextLink'
import FormField from '@/components/FormField'
import * as ImagePicker from 'expo-image-picker';
import UploadButton from '@/components/UploadButton'
import { images } from '@/constants/images'
import AuthLayout from './authLayout'
import { useAuth } from '@/app/context/AuthContext'
import CustomDropdown from '@/components/CustomDropdown'
import { checkEmptyForm, encodeImage } from '@/utils/commonFunctions'
import TextAreaField from '@/components/TextAreaField'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format, toZonedTime } from 'date-fns-tz';
import TimeField from '@/components/TimeField'
import BackButton from '@/components/BackButton'
import ProgressBar from '@/components/ProgressBar'
import { RegionType } from '@/types/types'
import InputLocationField from '@/components/InputLocationField'
import axios from 'axios'
import { add } from 'date-fns'
import Geocoder from 'react-native-geocoding';
import { requestNotificationPermission } from '@/utils/notificationUtils'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ModalAction from '@/components/ModalAction'
import TextFormLabel from '@/components/texts/TextFormLabel'
import TextTitle5 from '@/components/texts/TextTitle5'
import * as FileSystem from 'expo-file-system';

type ErrorState = {
  bakeryName: string | null;
  bakeryImage: string | null;
  bakeryDescription: string | null;
  bakeryPhoneNumber: string | null;
  openingTime: string | null;
  closingTime: string | null;
  bakeryAddress: string | null;
  halalCertificate: string | null;
};

const SignUpBakery = () => {

  const { signOut } = useAuth();

  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  const [form, setForm] = useState({
    bakeryName: '',
    bakeryImage: '',
    bakeryDescription: '',
    bakeryPhoneNumber: '',
    openingTime: '',
    closingTime: '',
    bakeryAddress: '',
    bakeryLatitude: 0,
    bakeryLongitude: 0,
    isHalal: 0,
    halalCertificate: '',
  })
  const [address, setAddress] = useState('')
  const [suggestions, setSuggestions] = useState([]);

  const emptyError: ErrorState = {
    bakeryName: null,
    bakeryImage: null,
    bakeryDescription: null,
    bakeryPhoneNumber: null,
    openingTime: null,
    closingTime: null,
    bakeryAddress: null,
    halalCertificate: null
  };
  const [error, setError] = useState<ErrorState>(emptyError);

  const [isSubmitting, setisSubmitting] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [timeFieldType, setTimeFieldType] = useState<"openingTime" | "closingTime">("openingTime");
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const pickImage = async (input: any) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result) {
      setError((prevError) => ({
        ...prevError,
        [input]: null,
      }));
    }

    if (!result.canceled) {
      setForm({ ...form, [input]: result.assets[0].uri })
    }
  };

  const showDatePicker = (type: 'openingTime' | 'closingTime') => {
    setTimeFieldType(type);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleSelectTime = (time: Date) => {
    const timezone = toZonedTime(time, "Asia/Jakarta");
    const formattedTime = format(timezone, "HH:mm");

    setForm((prevForm) => ({
      ...prevForm,
      [timeFieldType]: formattedTime,
    }));

    setError((prevError) => ({
      ...prevError,
      [timeFieldType]: null,
    }));

    hideDatePicker();
  };

  const handleGeocoding = (address: string) => {
    Geocoder.from(address)
      .then((json) => {
        const location = json.results[0].geometry.location;
        setForm({
          ...form,
          bakeryLatitude: location.lat,
          bakeryLongitude: location.lng,
          bakeryAddress: address,
        });
      })
      .catch((error) => console.warn(error));
  };

  const handleGetLocationSuggestionsAPI = () => {

    if (address === '') {
      setError((prevError) => ({ ...prevError, bakeryAddress: 'Alamat Bakeri tidak boleh kosong' }));
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

  const checkForm = async () => {
    try {
      setisSubmitting(true);

      setForm((prevForm) => ({
        ...prevForm,
        bakeryName: prevForm.bakeryName,
        bakeryDescription: prevForm.bakeryDescription,
      }));

      const errors = checkEmptyForm(form);
      if (Object.values(errors).some(error => error !== null)) {
        setError(errors as ErrorState);
        setisSubmitting(false);
        return;
      }

      let encodedBakeryImage = null;
      if (form.bakeryImage !== '') {
        encodedBakeryImage = await encodeImage(form.bakeryImage);
      }

      let encodedHalalCertificate = null;
      if (form.halalCertificate !== '') {
        encodedHalalCertificate = await encodeImage(form.halalCertificate);
      }

      const updatedForm = { ...form, bakeryImage: encodedBakeryImage, halalCertificate: encodedHalalCertificate };

      router.push({
        pathname: '/(auth)/signUpPaymentInfo' as any,
        params: { prevForm: JSON.stringify(updatedForm) },
      })
    } catch (error) {
      console.log(error);
    } finally {
      setisSubmitting(false);
    }
  }

  const headerContent = (
    <>
      <View className="flex-row items-center justify-between w-full space-x-4">
        <View className="flex-1 mx-2">
          <ProgressBar progress={0.1} />
        </View>
        <TouchableOpacity
          onPress={() => setLogoutModalVisible(true)}
        >
          <Ionicons name="log-out-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View className='items-center pb-5'>
        <TextHeader label="Daftar Bakeri" />
      </View>
    </>
  )

  return (
    <AuthLayout headerContent={headerContent} isScrollable>
      <View className="items-center">
        {form.bakeryImage ? (
          <Image
            source={{ uri: form.bakeryImage }}
            className="w-48 h-48 rounded-md"
            resizeMode="cover"
          />
        ) : (
          <View className="w-48 h-48 bg-gray-200 rounded-md" />
        )}
      </View>
      <View className="mb-4 w-full items-center">
        {error.bakeryImage && <ErrorMessage label={error.bakeryImage} />}
      </View>
      <View className="w-full items-center">
        <UploadButton
          label="Unggah Foto Bakeri"
          handlePress={() => {
            setError((prevError) => ({ ...prevError, bakeryImage: null }));
            pickImage("bakeryImage");
          }}
        />
      </View>
      <FormField
        label="Nama Bakeri"
        value={form.bakeryName}
        onChangeText={(text) => {
          setForm((prevForm) => ({ ...prevForm, bakeryName: text }));
          setError((prevError) => ({ ...prevError, bakeryName: null }));
        }}
        keyboardType="default"
        moreStyles='mt-7'
        error={error.bakeryName}
        placeholder="Masukkan nama bakeri"
      />
      <View className="flex-row space-x-4">
        <View className="flex-1">
          <TimeField
            label="Jam Buka"
            value={form.openingTime}
            onPress={() => showDatePicker("openingTime")}
            error={error.openingTime}
            moreStyles="mt-7"
          />
        </View>
        <View className="flex-1">
          <TimeField
            label="Jam Tutup"
            value={form.closingTime}
            onPress={() => showDatePicker("closingTime")}
            error={error.closingTime}
            moreStyles="mt-7"
          />
        </View>
      </View>
      <InputLocationField
        label="Alamat Bakeri"
        value={address}
        placeholder="Cari lokasi bakeri"
        onChangeText={(text) => {
          setAddress(text);
          setError((prevError) => ({ ...prevError, bakeryAddress: null }));
        }}
        moreStyles="mt-7"
        suggestions={suggestions}
        error={error.bakeryAddress}
        onSearch={() => handleGetLocationSuggestionsAPI()}
        onSelectSuggestion={handleSelectSuggestion}
      />
      <FormField
        label="Nomor Telepon Bakeri"
        value={form.bakeryPhoneNumber}
        onChangeText={(text) => {
          setForm((prevForm) => ({ ...prevForm, bakeryPhoneNumber: text }));
          setError((prevError) => ({
            ...prevError,
            bakeryPhoneNumber: null,
          }));
        }}
        keyboardType="phone-pad"
        moreStyles="mt-7"
        error={error.bakeryPhoneNumber}
        placeholder="Masukkan nomor telepon bakeri"
      />
      <TextAreaField
        label="Deskripsi Bakeri"
        value={form.bakeryDescription}
        onChangeText={(text) => {
          setForm((prevForm) => ({ ...prevForm, bakeryDescription: text }));
          setError((prevError) => ({
            ...prevError,
            bakeryDescription: null,
          }));
        }}
        keyboardType="default"
        moreStyles="mt-7"
        error={error.bakeryDescription}
        placeholder="Masukkan deskripsi bakeri"
      />
      <View className='mt-7 space-y-1'>
        <TextFormLabel label="Status Halal" />
        <View className='flex-row items-center'>
          <TextTitle5 label="Tidak" />
          <Switch
            value={form.isHalal === 1 ? true : false}
            onValueChange={(value) => {
              setForm((prevForm) => ({ ...prevForm, isHalal: value ? 1 : 0 }))
              setForm((prevForm) => ({ ...prevForm, halalCertificate: '' }))
              setError((prevError) => ({ ...prevError, halalCertificate: null }));
            }}
            trackColor={{
              false: "#D3D3D3",
              true: "#D6B09F",
            }}
            thumbColor={form.isHalal === 1 ? "#b0795a" : "gray"}
            className='mx-2'
          />
          <TextTitle5 label="Ya" />
        </View>
      </View>

      {
        form.isHalal === 1 && (
          <View className="mt-7 w-full flex-row space-x-4">
            <UploadButton label="Unggah Sertifikat Halal" handlePress={() => pickImage("halalCertificate")} />
            {form.halalCertificate && (
              <View className="w-24 h-20">
                <Image
                  source={{ uri: form.halalCertificate }}
                  className="w-full h-full rounded-md"
                />
              </View>
            )}
          </View>
        )
      }
      <ErrorMessage label={error.halalCertificate as any} />

      <CustomButton
        label='Lanjut'
        handlePress={() => checkForm()}
        buttonStyles='mt-10 w-full'
        isLoading={isSubmitting}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleSelectTime}
        onCancel={hideDatePicker}
      />

      <ModalAction
        setModalVisible={setLogoutModalVisible}
        modalVisible={logoutModalVisible}
        title="Apakah Anda yakin ingin keluar?"
        secondaryButtonLabel="Iya"
        primaryButtonLabel="Tidak"
        onSecondaryAction={() => signOut()}
        onPrimaryAction={() => setLogoutModalVisible(false)}
      />
    </AuthLayout>
  );
};

export default SignUpBakery;
