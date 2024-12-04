import { View, Text, Image } from 'react-native'
import React, { useTransition } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { router, Tabs, usePathname } from 'expo-router';

const TabsSellerLayout = () => {
  const currentPath = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleTabPress = (e: any, targetPath: any) => {
    e.preventDefault();

    if (currentPath === targetPath) {
      return;
    }

    startTransition(() => {
      router.replace(targetPath);
    });
  };

  console.log("first path", currentPath);

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#B0795A', tabBarInactiveTintColor: 'gray' }}>
      <Tabs.Screen
        name='home'
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={18} />
          ),
        }}
        listeners={{
          tabPress: (e) => handleTabPress(e, "/home"),
        }}
      />
      <Tabs.Screen
        name='order'
        options={{
          title: 'Pesanan',

          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bag' : 'bag-outline'} color={color} size={18} />
          ),
        }}
        listeners={{
          tabPress: (e) => handleTabPress(e, "/order"),
        }}
      />
      <Tabs.Screen
        name='product'
        options={{
          title: 'Daftar Produk',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'list' : 'list-outline'} color={color} size={18} />
          ),
        }}
        listeners={{
          tabPress: (e) => handleTabPress(e, "/product"),
        }}
      />
      {/* <Tabs.Screen
        name='profile'
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={18} />
          ),
        }}
        listeners={{
          tabPress: (e) => handleTabPress(e, "/profile"),
        }}
      /> */}
    </Tabs>
  );
};

export default TabsSellerLayout;