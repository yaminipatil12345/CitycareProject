// app/(admin)/all-issues.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAllComplaints,
  Complaint,
} from "../../services/complaintService";

export default function AllIssues() {
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

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.header}>All Issues</Text>
      <FlatList
        data={complaints}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.category} • {item.location}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No complaints reported yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  card: {
    backgroundColor: "#ffffffff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
  },
  title: { fontWeight: "700" },
});
