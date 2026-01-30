import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getComplaints, Complaint } from "../../services/complaintService";

const { width } = Dimensions.get("window");

export default function MyReports() {
  const [list, setList] = useState<Complaint[]>([]);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const load = async () => {
    try {
      const token = await AsyncStorage.getItem("access");
      if (!token) return;
      const arr = await getComplaints(token);
      setList(arr);
    } catch (e) {
      console.error("Failed to load complaints:", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const open = (c: Complaint) => {
    setSelected(c);
    setModalVisible(true);
  };

  const reported = list.length;
  const resolved = list.filter((c) => c.status === "RESOLVED").length;

  return (
    <LinearGradient colors={["#E0F2FE", "#F8FAFC"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>My Reports</Text>
          <Text style={styles.headerSubtitle}>
            Track and manage your city issues
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: "rgba(59,130,246,0.15)" }]}>
            <Text style={styles.statLabel}>Total Reports</Text>
            <Text style={styles.statValue}>{reported}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: "rgba(16,185,129,0.15)" }]}>
            <Text style={styles.statLabel}>Resolved</Text>
            <Text style={[styles.statValue, { color: "#059669" }]}>{resolved}</Text>
          </View>
        </View>

        {/* Reports List */}
        <Text style={styles.sectionTitle}>Recent Reports</Text>

        {list.length === 0 ? (
          <Text style={styles.emptyText}>No reports yet. Submit your first one!</Text>
        ) : (
          <FlatList
            data={list}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => open(item)}
                style={styles.reportCard}
                activeOpacity={0.9}
              >
                <LinearGradient colors={["#ffffff", "#f0f9ff"]} style={styles.reportContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reportTitle}>{item.title}</Text>
                    <Text style={styles.reportMeta}>
                      {item.category} • {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                    <Text
                      style={[
                        styles.reportStatus,
                        {
                          color:
                            item.status === "RESOLVED"
                              ? "#16a34a"
                              : item.status === "IN_PROGRESS"
                              ? "#f59e0b"
                              : "#dc2626",
                        },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selected?.title}</Text>
            <Text style={styles.modalDesc}>{selected?.description}</Text>
            <Text style={styles.modalMeta}>{selected?.location}</Text>
            <Text style={styles.modalStatus}>
              Status:{" "}
              <Text
                style={{
                  color:
                    selected?.status === "RESOLVED"
                      ? "#16a34a"
                      : selected?.status === "IN_PROGRESS"
                      ? "#f59e0b"
                      : "#dc2626",
                }}
              >
                {selected?.status}
              </Text>
            </Text>

            <Pressable style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 60 },
  headerCard: { backgroundColor: "#ffffffaa", borderRadius: 20, padding: 20, marginBottom: 20 },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#1E3A8A" },
  headerSubtitle: { fontSize: 14, color: "#475569", marginTop: 6 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  statBox: { flex: 1, borderRadius: 16, padding: 20, marginHorizontal: 6 },
  statLabel: { fontSize: 14, color: "#1E3A8A", marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: "bold", color: "#2563EB" },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10, color: "#1E293B" },
  emptyText: { textAlign: "center", color: "#6B7280", marginTop: 40 },
  reportCard: { marginBottom: 14, borderRadius: 16, overflow: "hidden" },
  reportContent: { padding: 16, borderRadius: 16 },
  reportTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  reportMeta: { fontSize: 13, color: "#475569", marginTop: 4 },
  reportStatus: { marginTop: 8, fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalCard: { width: width * 0.9, backgroundColor: "#fff", borderRadius: 16, padding: 20 },
  modalTitle: { fontWeight: "700", fontSize: 18, marginBottom: 8 },
  modalDesc: { color: "#374151", marginBottom: 6 },
  modalMeta: { color: "#6b7280", marginBottom: 10 },
  modalStatus: { fontWeight: "600", color: "#111827" },
  modalButton: { backgroundColor: "#2563EB", marginTop: 14, padding: 12, borderRadius: 10, alignItems: "center" },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
});
