import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import React from "react";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerTitle: "",
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTintColor: colors.text,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        drawerLabelStyle: { marginLeft: -8, fontSize: 14 },
        drawerStyle: { backgroundColor: "#FFFFFF" }
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Dashboard",
          drawerLabel: "Dashboard",
          drawerIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="grid-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen
        name="students"
        options={{
          title: "Students",
          drawerLabel: "Students",
          drawerIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="people-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen
        name="weak-topics"
        options={{
          title: "Weak Topics",
          drawerLabel: "Weak Topics",
          drawerIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="alert-circle-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen
        name="lesson-upload"
        options={{
          title: "Lesson Upload",
          drawerLabel: "Lesson Upload",
          drawerIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="cloud-upload-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen
        name="reports"
        options={{
          title: "Reports",
          drawerLabel: "Reports",
          drawerIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="bar-chart-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
          drawerLabel: "Settings",
          drawerIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="settings-outline" size={size} color={color} />
        }}
      />
    </Drawer>
  );
}


