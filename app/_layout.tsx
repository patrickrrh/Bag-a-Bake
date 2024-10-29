import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { Slot, Stack, router } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

function RootLayout() {
  const { isAuthenticated, isLoading, userData } = useAuth();

  console.log("user data", userData)
  console.log("is auth", isAuthenticated)

  useEffect(() => {
    
    if (!isLoading) {
      if (isAuthenticated === null) return;
      
      if (isAuthenticated === true && userData && userData.roleId === 1) {
        router.replace("/(tabsCustomer)/home");
      } else if (isAuthenticated === true && userData && userData.roleId === 2) {
        router.replace("/(tabsSeller)/home");
      } else if (isAuthenticated === false) {
        router.replace("/(auth)/signIn");
      }
    }
  }, [isAuthenticated, isLoading, userData]);

  return <Slot />;
}

export default function AppRootLayout() {
  return (
    <>
      <Toast />
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    </>
  );
}