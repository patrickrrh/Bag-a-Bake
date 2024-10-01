import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { Slot, Stack, router } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

function RootLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      console.log("isAuthenticated:", isAuthenticated);
      if (isAuthenticated === null) return;

      if (isAuthenticated) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/signIn");
      }
    }
  }, [isAuthenticated]);

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