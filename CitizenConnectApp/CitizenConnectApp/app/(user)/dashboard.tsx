import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useFocusEffect, useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getComplaints, Complaint } from "../../services/complaintService";

export default function Dashboard() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const load = async () => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return;
      const list = await getComplaints(token);
      setComplaints(list);
    } catch (e) {
      console.error("Failed to load complaints:", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const reported = complaints.length;
  const resolved = complaints.filter((c) => c.status === "RESOLVED").length;

  return (
    <LinearGradient
      colors={["#f0f9ff", "#ffffff"]}
      style={styles.container}
    >
      {/* Header Section */}
      <LinearGradient
        colors={["#a5d8ff", "#d0ebff"]}
        style={styles.headerCard}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcomeText}>Hello 👋</Text>
            <Text style={styles.userName}>{username || "User"}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(user)/profile")}>
            <Ionicons name="person-circle-outline" size={52} color="#1e3a8a" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: "#e3f2fd" }]}>
          <MaterialCommunityIcons
            name="alert-outline"
            size={30}
            color="#1e88e5"
          />
          <Text style={[styles.statValue, { color: "#0d47a1" }]}>{reported}</Text>
          <Text style={[styles.statLabel, { color: "#1565c0" }]}>Reported</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: "#e8f5e9" }]}>
          <MaterialCommunityIcons
            name="check-decagram-outline"
            size={30}
            color="#2e7d32"
          />
          <Text style={[styles.statValue, { color: "#1b5e20" }]}>{resolved}</Text>
          <Text style={[styles.statLabel, { color: "#2e7d32" }]}>Resolved</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#90caf9" }]}
          onPress={() => router.push("/(user)/report-issue")}
        >
          <Ionicons name="add-circle-outline" size={20} color="#0d47a1" />
          <Text style={[styles.actionText, { color: "#0d47a1" }]}>
            Report Issue
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#b39ddb" }]}
          onPress={() => router.push("/(user)/my-reports")}
        >
          <Ionicons name="list-outline" size={20} color="#311b92" />
          <Text style={[styles.actionText, { color: "#311b92" }]}>
            My Reports
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recent Reports */}
      <Text style={styles.sectionTitle}>Recent Reports</Text>
      <FlatList
        data={complaints.slice(0, 5)}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.reportCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reportTitle}>{item.title}</Text>
              <Text style={styles.reportDetails}>
                {item.category} •{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                item.status === "RESOLVED"
                  ? styles.statusResolved
                  : item.status === "IN_PROGRESS"
                  ? styles.statusProgress
                  : styles.statusPending,
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reports yet.</Text>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  headerCard: { borderRadius: 22, padding: 18, marginBottom: 25, elevation: 4 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  welcomeText: { color: "#1e3a8a", fontSize: 16 },
  userName: { fontSize: 26, color: "#0d47a1", fontWeight: "800" },
  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  statCard: { flex: 1, borderRadius: 16, paddingVertical: 16, alignItems: "center", marginHorizontal: 6 },
  statLabel: { fontSize: 15, fontWeight: "600", marginTop: 4 },
  statValue: { fontSize: 24, fontWeight: "800", marginTop: 6 },
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  actionButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 14, paddingVertical: 14, marginHorizontal: 6 },
  actionText: { fontSize: 16, fontWeight: "700", marginLeft: 8 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10, color: "#1e293b" },
  reportCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderRadius: 14, padding: 14, marginBottom: 10, elevation: 2 },
  reportTitle: { fontWeight: "700", color: "#0f172a", fontSize: 15 },
  reportDetails: { color: "#64748b", fontSize: 13, marginTop: 2 },
  statusBadge: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 12 },
  statusText: { fontWeight: "600", fontSize: 12 },
  statusResolved: { backgroundColor: "#e8f5e9" },
  statusProgress: { backgroundColor: "#fff8e1" },
  statusPending: { backgroundColor: "#ffebee" },
  emptyText: { textAlign: "center", color: "#90a4ae", fontSize: 14, marginTop: 10 },
});
