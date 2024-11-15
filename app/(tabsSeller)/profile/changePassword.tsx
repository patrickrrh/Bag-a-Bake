import {
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView,
    ScrollView,
  } from "react-native";
  import React, { useState } from "react";
  import CustomLogo from "@/components/CustomLogo";
  import TextHeader from "@/components/texts/TextHeader";
  import TextHeadline from "@/components/texts/TextHeadline";
  import TextLink from "@/components/texts/TextLink";
  import { router, useLocalSearchParams } from "expo-router";
  import BackButton from "@/components/BackButton";
  import TextTitle3 from "@/components/texts/TextTitle3";
  import TextTitle5Bold from "@/components/texts/TextTitle5Bold";
  import FormField from "@/components/FormField";
  import CustomButton from "@/components/CustomButton";
  import { useSafeAreaInsets } from "react-native-safe-area-context";
  import { checkPasswordErrors } from "@/utils/commonFunctions";
  import authenticationApi from "@/api/authenticationApi";
  import { showToast } from "@/utils/toastUtils";
  import Toast from "react-native-toast-message";
  import { OtpInput } from "react-native-otp-entry";
  import ProgressBar from "@/components/ProgressBar";
  import { Ionicons } from "@expo/vector-icons";
  import TextTitle5 from "@/components/texts/TextTitle5";
  import { useAuth } from "@/app/context/AuthContext";
  
  type ErrorState = {
    oldPassword: string | null;
    password: string | null;
    confirmPassword: string | null;
  };
  
  const ChangePassword = () => {
    const insets = useSafeAreaInsets();
    const { userData } = useAuth();
    const { email } = useLocalSearchParams();
  
    const emptyForm = {
      oldPassword: "",
      password: "",
    };
    const [form, setForm] = useState(emptyForm);
    const [confirmPassword, setConfirmPassword] = useState("");
  
    const emptyError: ErrorState = {
      oldPassword: null,
      password: null,
      confirmPassword: null,
    };
    const [error, setError] = useState<ErrorState>(emptyError);
  
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleChangePasswordApi = async () => {
      try {
        setIsSubmitting(true);
        const email = userData?.email || "";
  
        const errors = await checkPasswordErrors(
          form,
          confirmPassword,
          email,
          authenticationApi
        );
  
        if (Object.values(errors).some((error) => error !== null)) {
          setError(errors as ErrorState);
          return;
        }
  
        const res = await authenticationApi().changePassword({
          email: email,
          password: form.password,
        });
        console.log("res", res);
        if (res.status === 200) {
          console.log("sudah terganti passwordnya");
          showToast("success", "Kata Sandi berhasil diubah");
          router.back();
        } else {
          showToast("error", res.error);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <SafeAreaView className='bg-background h-full flex-1'>
        <View className="flex-row items-center px-4 pt-10 pb-2 relative">
          {/* Back Button */}
          <View className="pl-5">
            <BackButton />
          </View>
  
          {/* Title */}
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 40,
            }}
          >
            <TextTitle3 label="Ganti Kata Sandi" />
          </View>
        </View>
  
        <View style={{ paddingHorizontal: 20, flex: 1 }}>
          <FormField
            label="Password Lama"
            value={form.oldPassword}
            onChangeText={(text) => {
              setForm({ ...form, oldPassword: text });
              setError((prevError) => ({ ...prevError, oldPassword: null }));
            }}
            keyboardType="default"
            moreStyles="mt-7"
            error={error.oldPassword}
          />
  
          <FormField
            label="Password Baru"
            value={form.password}
            onChangeText={(text) => {
              setForm({ ...form, password: text });
              setError((prevError) => ({ ...prevError, password: null }));
            }}
            keyboardType="default"
            moreStyles="mt-7"
            error={error.password}
          />
  
          <FormField
            label="Konfirmasi Password Baru"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError((prevError) => ({
                ...prevError,
                confirmPassword: null,
              }));
            }}
            keyboardType="default"
            moreStyles="mt-7"
            error={error.confirmPassword}
          />
  
          <CustomButton
            label="Simpan"
            handlePress={() => {
              handleChangePasswordApi();
            }}
            buttonStyles="mt-8"
            isLoading={isSubmitting}
          />
        </View>
      </SafeAreaView>
    );
  };
  
  export default ChangePassword;
  