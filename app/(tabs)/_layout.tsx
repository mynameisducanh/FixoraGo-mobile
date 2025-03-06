import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from '@expo/vector-icons/AntDesign';
import { HapticTab } from "@/components/HapticTab";
import Octicons from '@expo/vector-icons/Octicons';
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import "../../global.css";
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        headerTitle: '',
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activate"
        options={{
          title: "Hoạt động",
          tabBarIcon: ({ color }) => (
            <Octicons name="checklist" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Tin nhắn",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="comments" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Tài khoản",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
