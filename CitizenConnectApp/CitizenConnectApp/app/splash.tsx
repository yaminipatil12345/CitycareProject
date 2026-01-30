// app/splash.tsx
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.replace("/"), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.text}>CityCare</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#b8d0eaff", justifyContent: "center", alignItems: "center" },
  logo: { width: 120, height: 120, resizeMode: "contain" },
  text: { color: "rgba(23, 21, 21, 1)", fontSize: 28, fontWeight: "800", marginTop: 12 },
});
