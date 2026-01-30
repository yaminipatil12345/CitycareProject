// app/auth/forgotpassword.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AnimatedScreen from "../../components/AnimatedScreen";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleReset = () => {
    if (!email) {
      Alert.alert("Please enter your email.");
      return;
    }
    Alert.alert("Password reset link sent to " + email);
    router.push("/auth/login");
  };

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.image}
        />

        <Text style={styles.title}>Forgot Password</Text>
        

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>RESET PASSWORD</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.backText}>
            Back to <Text style={styles.backLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // plain white background
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E293B", // dark grey-blue for professionalism
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#475569", // soft grey
    marginBottom: 18,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  button: {
    width: "100%",
    backgroundColor: "#7f9de8ff", // professional mild blue
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  backText: { color: "#475569", fontSize: 14 },
  backLink: { color: "#2563EB", fontWeight: "bold" },
});
