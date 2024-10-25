import { View, Text, Image } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import CreateProduct from './createProduct';
import Home from './home';
import ListProduct from './listProduct';
import Order from './order';
import Profile from './profile';
import OrderDetail from './orderDetail';
import { Ionicons } from "@expo/vector-icons";

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

const OrderStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrderScreen"
        component={Order}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

const TabsSellerLayout = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ListProduct':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Order':
              iconName = focused ? 'bag' : 'bag-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          const title = route.name === 'Home' ? 'Beranda' :
            route.name === 'Order' ? 'Pesanan' :
              route.name === 'ListProduct' ? 'Daftar Produk' :
                route.name === 'Profile' ? 'Profil' : '';

          return (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={iconName} size={18} color={focused ? '#B0795A' : 'gray'} />
              <Text style={{
                marginVertical: 5,
                fontSize: 10,
                fontFamily: 'poppinsRegular',
                color: focused ? '#B0795A' : 'gray',
              }}>
                {title}
              </Text>
            </View>
          );
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 80
        }
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: 'Beranda' }} />
      <Tab.Screen name="Order" component={OrderStack} options={{ title: 'Pesanan' }} />
      <Tab.Screen name="ListProduct" component={ListProductStack} options={{ title: 'Daftar Produk' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
};

export default TabsSellerLayout;