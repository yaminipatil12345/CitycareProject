// app/(admin)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="manage-complaints" options={{ title: "Manage" }} />
      <Tabs.Screen name="all-issues" options={{ title: "All Issues" }} />
      <Tabs.Screen name="notification" options={{ title: "Notifications" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
