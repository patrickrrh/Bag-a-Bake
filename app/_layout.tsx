import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { Href, Slot, Stack, router } from "expo-router";
import { useEffect } from "react";
import { Platform, SafeAreaView, StatusBar, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import Toast from "react-native-toast-message";

function RootLayout() {
  const { isAuthenticated, isLoading, userData, isEditProfile } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated === null) return;

      if (isAuthenticated === true && isEditProfile === false && userData && userData.roleId === 1) {
        router.replace("/(tabsCustomer)");
      } else if (isAuthenticated === true && isEditProfile === false && userData && userData.roleId === 2) {
        router.replace("/(tabsSeller)/home" as any);
      } else if (isAuthenticated === false) {
        router.replace("/(auth)/signIn");
      }
    }
  }, [isAuthenticated, isLoading, userData]);

  return <Slot />;
}

export default function AppRootLayout() {
  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? 20 : 0,
        backgroundColor: "#fff",
      }}
    >
      <StatusBar
        barStyle={Platform.OS === "android" ? "dark-content" : "default"}
        backgroundColor="transparent"
        translucent={true}
      />

      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <Toast topOffset={50} />
      </View>
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    </View>
  );
}