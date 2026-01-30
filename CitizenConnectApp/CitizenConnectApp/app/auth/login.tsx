import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnimatedScreen from "../../components/AnimatedScreen";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { loginUser } from "../../services/apiClient";

export default function LoginScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loadingCreds, setLoadingCreds] = useState(true);
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("email");
        const savedPassword = await AsyncStorage.getItem("password");
        if (savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (e) {
        console.log("Error loading creds:", e);
      } finally {
        setLoadingCreds(false);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter both email and password.");
      return;
    }

    try {
      const data = await loginUser({ email, password });
      // Save tokens for later requests
      await AsyncStorage.setItem("access", data.tokens.access);
      await AsyncStorage.setItem("refresh", data.tokens.refresh);

      if (rememberMe) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", password);
      } else {
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("password");
      }

      Alert.alert("✅ Login Successful", `Welcome ${data.user.name}`);
      if (data.user.is_admin || activeTab === "admin")
        router.push("/(admin)/dashboard");
      else router.push("/(user)/dashboard");
    } catch (err: any) {
      Alert.alert("❌ Login Failed", err.message || "Invalid credentials");
    }
  };

  if (loadingCreds) return null;

  return (
    <AnimatedScreen>
      <LinearGradient colors={["#E3F2FD", "#F8FBFF", "#ffffff"]} style={styles.gradient}>
        <View style={styles.container}>
          <Image source={require("../../assets/logo.png")} style={styles.image} />

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "user" && styles.activeTab]}
              onPress={() => setActiveTab("user")}
            >
              <Text style={[styles.tabText, activeTab === "user" && styles.activeTabText]}>
                USER
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "admin" && styles.activeTab]}
              onPress={() => setActiveTab("admin")}
            >
              <Text style={[styles.tabText, activeTab === "admin" && styles.activeTabText]}>
                ADMIN
              </Text>
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Remember Me */}
          <View style={styles.rememberRow}>
            <BouncyCheckbox
              size={22}
              fillColor="#1976D2"
              text="Remember Me"
              isChecked={rememberMe}
              onPress={(checked: boolean) => setRememberMe(checked)}
            />
            <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>

          {/* Signup Redirect */}
          <TouchableOpacity onPress={() => router.push("/auth/signup")}>
            <Text style={styles.signupText}>
              Don’t have an account?{" "}
              <Text style={{ color: "#1976D2", fontWeight: "bold" }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  image: { width: 140, height: 140, marginBottom: 30 },
  tabContainer: { flexDirection: "row", marginBottom: 25, borderWidth: 1 },
  tab: { padding: 12, backgroundColor: "#ECEFF1" },
  activeTab: { backgroundColor: "#1976D2" },
  tabText: { fontSize: 18, color: "#555" },
  activeTabText: { color: "#fff" },
  input: { width: "100%", height: 50, borderWidth: 1, marginBottom: 15, padding: 10 },
  rememberRow: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  forgotPassword: { color: "#1976D2" },
  button: { backgroundColor: "#2196F3", padding: 15, borderRadius: 12, width: "100%", marginTop: 15 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: "center" },
  signupText: { marginTop: 15, color: "#333" },
});
