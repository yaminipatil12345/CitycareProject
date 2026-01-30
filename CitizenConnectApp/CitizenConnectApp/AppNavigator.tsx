import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AdminDashboard from "./screens/admin/AdminDashboard";
import ProfileScreen from "./screens/Profile"; // use your Profile.tsx

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Dashboard */}
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboard} 
          options={{ headerShown: false }} // hide default header
        />

        {/* Profile */}
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: "My Profile" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
