import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");   // empty by default
  const [phone, setPhone] = useState(""); // empty by default
  const [email, setEmail] = useState(""); // empty by default

  const handleEditToggle = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleLogout = () => alert("Logged out successfully!");
  const handleUploadPhoto = () => alert("Upload photo feature coming soon!");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleUploadPhoto} disabled={!isEditing}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.avatar}
          />
          <View style={styles.uploadBadge}>
            <Ionicons name="camera-outline" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{name || "Enter Your Name"}</Text>
        <Text style={styles.status}>Active Member</Text>
      </View>

      {/* Details Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.inputRow} pointerEvents={isEditing ? "auto" : "none"}>
          <Ionicons name="person-outline" size={20} color="#6B7280" />
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={name}
            editable={isEditing}
            onChangeText={setName}
            placeholder="Enter Your Name"
          />
        </View>

        <View style={styles.inputRow} pointerEvents={isEditing ? "auto" : "none"}>
          <Ionicons name="call-outline" size={20} color="#6B7280" />
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={phone}
            editable={isEditing}
            onChangeText={setPhone}
            placeholder="Enter Your Mobile Number"
          />
        </View>

        <View style={styles.inputRow} pointerEvents={isEditing ? "auto" : "none"}>
          <Ionicons name="mail-outline" size={20} color="#6B7280" />
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={email}
            editable={isEditing}
            onChangeText={setEmail}
            placeholder="Enter Your Email-Id"
            keyboardType="email-address"
          />
        </View>
      </View>

      {/* Address Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Address & Location</Text>
        <View style={styles.addressRow}>
          <Ionicons name="home-outline" size={20} color="#6B7280" />
          <Text style={styles.addressText}>Nashik</Text>
        </View>
      </View>

      {/* Edit / Save Button */}
      {!isEditing ? (
        <TouchableOpacity style={styles.editButton} onPress={handleEditToggle}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC", // light background like Manage Complaint
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#3B82F6", // professional blue accent
  },
  uploadBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#3B82F6",
    borderRadius: 20,
    padding: 6,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 10,
  },
  status: {
    fontSize: 14,
    color: "#22C55E",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#0F172A",
  },
  disabledInput: {
    color: "#6B7280",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
  },
  addressText: {
    flex: 1,
    marginLeft: 10,
    color: "#475569",
    fontSize: 14,
  },
  editButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
    elevation: 3,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
