import { ScrollView, View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";
import CustomLogo from "@/components/CustomLogo";

export default function SplashScreen() {

  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const fadeOutAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

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
