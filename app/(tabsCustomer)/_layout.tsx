import React, { useRef, useEffect } from "react";
import { router, Tabs, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TabsCustomerLayout = () => {
  const currentPath = usePathname();
  const lastNavigatedPath = useRef(currentPath);

  useEffect(() => {
    lastNavigatedPath.current = currentPath;
  }, [currentPath]);

  const handleTabPress = (e: any, targetPath: any) => {
    if (lastNavigatedPath.current !== targetPath) {
      e.preventDefault();
      lastNavigatedPath.current = targetPath;
      router.replace(targetPath);
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#B0795A",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} color={color} size={18} />
          ),
        }}
        listeners={{
          tabPress: (e) => handleTabPress(e, "/(tabsCustomer)"),
        }}
      />
      <Tabs.Screen
        name="bakery"
        options={{
          title: "Bakeri",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "storefront" : "storefront-outline"} color={color} size={18} />
          ),
        }}
        listeners={{
          tabPress: (e) => handleTabPress(e, "/bakery"),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Pesanan",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "bag" : "bag-outline"} color={color} size={18} />
          ),
        }}
        listeners={{
          tabPress: (e) => handleTabPress(e, "/(tabsCustomer)/order"),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} color={color} size={18} />
          ),
        }}
        listeners={{
          tabPress: (e) => handleTabPress(e, "/(tabsCustomer)/profile/profilePage"),
        }}
      />
    </Tabs>
  );
};

export default TabsCustomerLayout;
