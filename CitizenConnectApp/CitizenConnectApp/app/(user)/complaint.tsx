// app/(user)/complaint.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
 // Make sure to install react-native-linear-gradient

export default function Complaint() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Garbage");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Location access is required");
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(`Lat: ${loc.coords.latitude}, Lng: ${loc.coords.longitude}`);
  };

  const handleSubmit = () => {
    if (!title || !category || !location || !description) {
      Alert.alert("Error", "Please fill all details!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Issue submitted successfully!", [
        { text: "OK", onPress: () => router.push("/(user)/dashboard") },
      ]);
      setTitle("");
      setCategory("Garbage");
      setLocation("");
      setDescription("");
      setImageUri(null);
    }, 1500);
  };

  return (
    <LinearGradient
      colors={["#4A90E2", "#6DD5FA", "#ffffff"]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.title}>Report New Issue</Text>

          <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />

          <View style={styles.pickerContainer}>
            <Picker selectedValue={category} onValueChange={(val) => setCategory(val)}>
              <Picker.Item label="Garbage Collection" value="Garbage" />
              <Picker.Item label="Road / Potholes" value="Road" />
              <Picker.Item label="Streetlight Issue" value="Streetlight" />
              <Picker.Item label="Water Supply" value="Water" />
              <Picker.Item label="Sewage / Drainage" value="Sewage" />
              <Picker.Item label="Public Transport" value="Transport" />
              <Picker.Item label="Pollution / Cleanliness" value="Pollution" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <TextInput placeholder="Location" value={location} onChangeText={setLocation} style={styles.input} />

          <TouchableOpacity style={[styles.btn, { backgroundColor: "#7c3aed" }]} onPress={getCurrentLocation}>
            <Text style={styles.btnText}>Use Current Location</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={[styles.input, { height: 100 }]}
          />

          <TouchableOpacity style={[styles.btn, { backgroundColor: "#2563EB" }]} onPress={pickImage}>
            <Text style={styles.btnText}>{imageUri ? "Change Photo" : "Upload Photo"}</Text>
          </TouchableOpacity>

          {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={[styles.btn, { backgroundColor: loading ? "#9ca3af" : "#16a34a" }]}
          >
            <Text style={styles.btnText}>{loading ? "Submitting..." : "Submit Issue"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 20 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 15 },
  pickerContainer: { backgroundColor: "#fff", borderRadius: 10, marginBottom: 15 },
  btn: { padding: 15, borderRadius: 12, marginBottom: 15 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  image: { width: "100%", height: 200, borderRadius: 12, marginBottom: 15 },
});
