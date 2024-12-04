import { View, Text, ScrollView, Image, Button } from 'react-native'
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
import { checkEmptyForm } from '@/utils/commonFunctions'
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

type ErrorState = {
  bakeryName: string | null;
  bakeryImage: string | null;
  bakeryDescription: string | null;
  bakeryPhoneNumber: string | null;
  openingTime: string | null;
  closingTime: string | null;
  bakeryAddress: string | null;
};

const SignUpBakery = () => {

  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  const { prevForm } = useLocalSearchParams();
  const parsedPrevForm = prevForm && typeof prevForm === 'string' ? JSON.parse(prevForm) : {};

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
  };
  const [error, setError] = useState<ErrorState>(emptyError);

  const [isSubmitting, setisSubmitting] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [timeFieldType, setTimeFieldType] = useState<"openingTime" | "closingTime">("openingTime");

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      ...parsedPrevForm,
      roleId: parseInt(parsedPrevForm.roleId),
    }));
  }, [prevForm]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result) {
      setError((prevError) => ({
        ...prevError,
        bakeryImage: null,
      }));
    }

    if (!result.canceled) {
      setForm({ ...form, bakeryImage: result.assets[0].uri })
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
      setError((prevError) => ({ ...prevError, bakeryAddress: 'Alamat Toko tidak boleh kosong' }));
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
        console.log("reponse", response);
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
        bakeryName: prevForm.bakeryName.trim(),
        bakeryDescription: prevForm.bakeryDescription.trim(),
      }));

      const errors = checkEmptyForm(form);
      if (Object.values(errors).some(error => error !== null)) {
        setError(errors as ErrorState);
        setisSubmitting(false);
        return;
      }

      router.push({
        pathname: '/(auth)/signUpPaymentInfo' as any,
        params: { prevForm: JSON.stringify(form) },
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
        <BackButton />
        <View className="flex-1 mx-2">
          <ProgressBar progress={0.4} />
        </View>
      </View>
      <View className='items-center pb-5'>
        <TextHeader label="Daftar Akun" />
      </View>
    </>
  )

  const footerContent = (
    <>
      <View className='mr-1'>
        <TextHeadline label='Sudah memiliki akun?' />
      </View>
      <TextLink label="Masuk disini" size={14} onPress={() => router.push('/(auth)/signIn')} />
    </>
  );

  return (
    <AuthLayout headerContent={headerContent} footerContent={footerContent} isScrollable>
      <FormField
        label="Nama Toko"
        value={form.bakeryName}
        onChangeText={(text) => {
          setForm((prevForm) => ({ ...prevForm, bakeryName: text }));
          setError((prevError) => ({ ...prevError, bakeryName: null }));
        }}
        keyboardType="default"
        error={error.bakeryName}
        placeholder="Masukkan nama toko"
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
        label="Alamat Toko"
        value={address}
        placeholder="Cari lokasi toko"
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
        label="Nomor Telepon Toko"
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
        placeholder="Masukkan nomor telepon toko"
      />
      <TextAreaField
        label="Deskripsi Toko"
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
        placeholder="Masukkan deskripsi toko"
      />

      <View className="mt-8 w-full flex-row space-x-4">
        <UploadButton label="Unggah Foto Toko" handlePress={pickImage} />
        {form.bakeryImage && (
          <View className="w-24 h-20">
            <Image
              source={{ uri: form.bakeryImage }}
              className="w-full h-full rounded-md"
            />
          </View>
        )}
      </View>
      {error.bakeryImage && (
        <ErrorMessage label={error.bakeryImage} />
      )}

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
    </AuthLayout>
  );
};

export default SignUpBakery;
