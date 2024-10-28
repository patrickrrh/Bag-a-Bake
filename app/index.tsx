import { useFonts } from "expo-font";

export default function Index() {

  const [fontsLoaded] = useFonts({
    dk: require('../assets/fonts/DK-Woolwich.otf'),
    poppinsLight: require('../assets/fonts/Poppins-Light.ttf'),
    poppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
    poppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    poppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

}
