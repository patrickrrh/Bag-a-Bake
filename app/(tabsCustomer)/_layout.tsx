import { View, Text, Image, ImageSourcePropType } from "react-native";
import React from "react";
import { Stack, Tabs, Redirect } from "expo-router";

import { icons } from "@/constants/icons";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

interface Props {
  icon: ImageSourcePropType;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<Props> = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center">
      <Image 
        source = {icon}
        resizeMode = "contain"
        tintColor = {color}
        className = "w-6 h-6"
      />
      <Text className = {`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}>
        {name}
      </Text>
    </View>
  )
}

const TabsCustomerLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
            tabBarShowLabel: false
        }}
      >
        <Tabs.Screen 
          name="home"
          options={{ 
            title: 'Beranda',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon = {icons.home}
                color = {color}
                name = "Beranda"
                focused = {focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name="order"
          options={{
            title: "Pesanan",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bag}
                color={color}
                name="Pesanan"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="bakery"
          options={{ 
            title: "Bakery",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.store}
                color={color}
                name="Bakery"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profil"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="orderPage"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Create"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="orderDetail"
          options={{
            title: "Detail",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Detail"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="orderHistory"
          options={{
            title: "History",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="History"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="bakeryDetail"
          options={{
            title: "SDetail",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="SDetail"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsCustomerLayout;