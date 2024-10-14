import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { Slot, Stack, router } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

function RootLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  console.log("apa status is auth", isAuthenticated)
  console.log("apa is loading", isLoading)

  useEffect(() => {
    if (!isLoading) {
      console.log("isAuthenticated:", isAuthenticated);
      if (isAuthenticated === null) return;

      if (isAuthenticated === true) {
        router.replace("/(tabs)/home");
      } else if (isAuthenticated === false) {
        router.replace("/(auth)/signIn");
      }
    }
  }, [isAuthenticated, isLoading]);

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