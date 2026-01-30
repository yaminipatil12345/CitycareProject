import React from "react";
import { View, StyleSheet, ImageBackground, ScrollView } from "react-native";

export default function ScreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <ImageBackground
      source={require("../assets/bg-city.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        {children}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
});
