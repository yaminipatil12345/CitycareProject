import React, { useState } from "react";
import { View, Text, Image, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import { postData } from "../../services/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReportIssue() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Garbage");
  const [locationText, setLocationText] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please enable location access.");
      return;
    }
    const pos = await Location.getCurrentPositionAsync({});
    setLocationText(`Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`);
  };

  const handleSubmit = async () => {
    if (!title || !description || !locationText) {
      Alert.alert("Missing Fields", "Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access");
      await postData("issues/report/", {
        problem: title,
        problem_type: category,
        location: locationText,
        description,
      }, token!);
      Alert.alert("✅ Success", "Your complaint has been submitted!");
      router.push("/(user)/my-reports");
    } catch (e: any) {
      Alert.alert("❌ Error", e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#F5F6FA", "#FFFFFF"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 10 }}>Report an Issue</Text>
        <AppInput placeholder="Title" value={title} onChangeText={setTitle} />
        <Picker selectedValue={category} onValueChange={(v) => setCategory(v)}>
          <Picker.Item label="Garbage Collection" value="Garbage" />
          <Picker.Item label="Road / Potholes" value="Road" />
          <Picker.Item label="Streetlight Issue" value="Streetlight" />
          <Picker.Item label="Water Supply" value="Water" />
          <Picker.Item label="Sewage / Drainage" value="Sewage" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
        <AppInput placeholder="Enter location" value={locationText} onChangeText={setLocationText} />
        <AppButton title="📍 Use Current Location" onPress={getCurrentLocation} />
        <AppInput placeholder="Description" value={description} onChangeText={setDescription} multiline />
        <AppButton title={imageUri ? "Change Photo" : "Upload Photo"} onPress={pickImage} />
        {imageUri && <Image source={{ uri: imageUri }} style={{ width: "100%", height: 200, marginVertical: 10 }} />}
        <AppButton title={loading ? "Submitting..." : "Submit Issue"} onPress={handleSubmit} disabled={loading} />
      </ScrollView>
    </LinearGradient>
  );
}
