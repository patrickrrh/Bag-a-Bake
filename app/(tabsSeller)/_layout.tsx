import { View, Text, Image } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';

const TabsSellerLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#B0795A', tabBarInactiveTintColor: 'gray' }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={18} />
          ),
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
      />
      <Tabs.Screen
        name='product'
        options={{
          title: 'Daftar Produk',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'list' : 'list-outline'} color={color} size={18} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={18} />
          ),
          unmountOnBlur: true
        }}
      />
    </Tabs>
  );
};

export default TabsSellerLayout;