import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TabsCustomerLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#B0795A', tabBarInactiveTintColor: 'gray' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={18} />
          ),
        }}
      />
      <Tabs.Screen
        name="bakery"
        options={{
          title: 'Bakeri',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'storefront' : 'storefront-outline'} color={color} size={18} />
          )
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: 'Pesanan',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bag' : 'bag-outline'} color={color} size={18} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
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

export default TabsCustomerLayout;