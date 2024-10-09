import { View, Text, Image } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import CreateProduct from './createProduct';
import Home from './home';
import ListProduct from './listProduct';
import Orders from './orders';
import Profile from './profile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ListProductStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ListProduct" 
        component={ListProduct} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="CreateProduct" 
        component={CreateProduct} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

const TabsSellerLayout = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconSource;

          switch (route.name) {
            case 'Home':
              iconSource = focused
                ? require('@/assets/images/sellerNavBar/homeIconFocus.png')
                : require('@/assets/images/sellerNavBar/homeIconUnfocus.png');
              break;
            case 'ListProduct':
              iconSource = focused
                ? require('@/assets/images/sellerNavBar/listProductIconFocus.png')
                : require('@/assets/images/sellerNavBar/listProductIconUnfocus.png');
              break;
            case 'Orders':
              iconSource = focused
                ? require('@/assets/images/sellerNavBar/orderIconFocus.png')
                : require('@/assets/images/sellerNavBar/orderIconUnfocus.png');
              break;
            case 'Profile':
              iconSource = focused
                ? require('@/assets/images/sellerNavBar/profileIconFocus.png')
                : require('@/assets/images/sellerNavBar/profileIconUnfocus.png');
              break;
            default:
              iconSource = require('@/assets/images/sellerNavBar/homeIconUnfocus.png'); 
          }

          const title = route.name === 'Home' ? 'Beranda' :
                        route.name === 'Orders' ? 'Pesanan' :
                        route.name === 'ListProduct' ? 'Daftar Produk' :
                        route.name === 'Profile' ? 'Profil' : '';

          return (
            <View style={{ alignItems: 'center' }}>
              <Image
                source={iconSource}
                style={{ height: 17 }}
                resizeMode="contain"
              />

            <Text style={{ 
                marginTop: 2,
                fontSize: 10, 
                fontWeight: focused ? 'bold' : 'normal',
              }}>
                {title} 
              </Text>

            </View>
          );
        },
        tabBarShowLabel: false, 
        headerShown: false, 
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: 'Beranda' }} />
      <Tab.Screen name="Orders" component={Orders} options={{ title: 'Pesanan' }} />
      <Tab.Screen name="ListProduct" component={ListProductStack} options={{ title: 'Daftar Produk' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
};

export default TabsSellerLayout;