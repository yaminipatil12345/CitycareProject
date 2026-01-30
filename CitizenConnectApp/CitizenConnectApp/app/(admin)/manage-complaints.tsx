// app/(admin)/manage-complaints.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAllComplaints,
  updateComplaintStatus,
  Complaint,
} from "../../services/complaintService";

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const load = async () => {
    const token = await AsyncStorage.getItem("access"); // ✅ correct key
    if (!token) return;
    try {
      const data = await getAllComplaints(token);
      setComplaints(data);
    } catch (e) {
      console.error("Admin load error:", e);
      Alert.alert("Error", "Failed to load complaints");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: Complaint["status"]) => {
    const token = await AsyncStorage.getItem("access"); // ✅ correct key
    if (!token) return;
    try {
      await updateComplaintStatus(id, status, token);
      Alert.alert("✅ Updated", `Complaint marked as ${status}`);
      load(); // reload updated list
    } catch (e) {
      console.error("Status update error:", e);
      Alert.alert("Error", "Could not update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#FDE68A";
      case "IN_PROGRESS":
        return "#93C5FD";
      case "RESOLVED":
        return "#86EFAC";
      case "REPORT":
        return "#FCA5A5";
      default:
        return "#E5E7EB";
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#F0F9FF", "#FFFFFF"]} style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Ionicons name="construct-outline" size={32} color="#3B82F6" />
          <Text style={styles.pageTitle}>Manage Complaints</Text>
          <Text style={styles.pageSubtitle}>
            Review, update, and resolve citizen complaints below.
          </Text>
        </View>

        {/* Complaints List */}
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTopRow}>
                <Ionicons
                  name="document-text-outline"
                  size={26}
                  color="#60A5FA"
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardId}>Complaint ID: #{item.id}</Text>
                  <Text style={styles.cardLocation}>{item.location}</Text>
                </View>
              </View>

              {/* Status Badge */}
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Status:</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              {/* Status Buttons */}
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                {["PENDING", "IN_PROGRESS", "RESOLVED", "REPORT"].map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => updateStatus(item.id, s as any)}
                    style={[
                      styles.updateBtn,
                      {
                        backgroundColor:
                          item.status === s ? "#2563EB" : "#93C5FD",
                      },
                    ]}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "#64748B", marginTop: 20 }}>
              No complaints yet.
            </Text>
          }
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 22 },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  pageTitle: { fontSize: 24, fontWeight: "700", color: "#1E293B", marginTop: 10 },
  pageSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    textAlign: "center",
    maxWidth: "85%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardTopRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardTitle: { fontSize: 17, fontWeight: "600", color: "#1E293B" },
  cardId: { fontSize: 13, color: "#94A3B8", marginTop: 2 },
  cardLocation: { fontSize: 13, color: "#64748B", marginTop: 2 },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  statusLabel: { fontSize: 15, fontWeight: "500", color: "#475569" },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    minWidth: 90,
    alignItems: "center",
  },
  statusText: { fontWeight: "600", fontSize: 13 },
  updateBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 13 },
});
