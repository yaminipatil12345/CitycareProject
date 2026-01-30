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
import AnimatedScreen from "../../components/AnimatedScreen";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { postData } from "../../services/apiClient";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match.");
      return;
    }
    try {
      await postData("auth/register/", { name, email, password });
      Alert.alert("✅ Account created", "Please login now.");
      router.push("/auth/login");
    } catch (err: any) {
      Alert.alert("❌ Signup failed", err.message);
    }
  };

  return (
    <AnimatedScreen>
      <LinearGradient colors={["#E3F2FD", "#F8FBFF", "#ffffff"]} style={styles.gradient}>
        <View style={styles.container}>
          <Image source={require("../../assets/logo.png")} style={styles.image} />
          <Text style={styles.title}>Create Account</Text>

          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none"/>
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword}/>
          <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword}/>

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.signupText}>
              Already have an account?{" "}
              <Text style={{ color: "#1976D2", fontWeight: "bold" }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  image: { width: 140, height: 140, marginBottom: 30 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 12 },
  input: { width: "100%", height: 50, borderWidth: 1, marginBottom: 15, padding: 10 },
  button: { backgroundColor: "#2196F3", padding: 15, borderRadius: 12, width: "100%", marginTop: 15 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: "center" },
  signupText: { marginTop: 15, color: "#333" },
});
