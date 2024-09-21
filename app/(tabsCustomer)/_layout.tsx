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
          name="productDetail"
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
      </Tabs>
    </>
  );
};

export default TabsCustomerLayout;