import { Image, ScrollView, Text, View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants/images";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useFonts } from "expo-font";
import CustomLogo from "@/components/CustomLogo";

export default function Index() {

  const [fontsLoaded] = useFonts({
    dk: require('../assets/fonts/DK-Woolwich.otf'),
    poppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
    poppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    poppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
  });

  const router = useRouter();
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      router.push("/login")
    }, 5000);

    return () => clearTimeout(timeout);
  }, [fadeAnimation, router]);

  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="h-full w-full justify-center items-center px-4 bg-background">
          <Animated.View style={{ opacity: fadeAnimation }}>
            <CustomLogo imageWidth={160} imageHeight={160} fontSize={30} />
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
