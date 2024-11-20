import { useFonts } from "expo-font";
import Geocoder from 'react-native-geocoding';

export default function Index() {

  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string

  Geocoder.init(GOOGLE_MAPS_API_KEY);

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
