import React, { useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDataAuth } from "../../services/apiClient";

export default function AdminNotifications() {
  const [notes, setNotes] = useState<any[]>([]);

  const load = async () => {
    try {
      const token = await AsyncStorage.getItem("access"); // 🔑 use "access" since apiClient stores that
      if (!token) return;
      const data = await getDataAuth("admin/notifications/", token);
      setNotes(data.notifications || []);
    } catch (e) {
      console.error("Failed to load admin notifications:", e);
      Alert.alert("Error", "Failed to load admin notifications");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F8FAFC" }}>
      <Text style={styles.header}>Admin Notifications</Text>
      <FlatList
        data={notes}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
            No notifications available
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1E3A8A",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#0F172A",
  },
  message: {
    fontSize: 14,
    color: "#475569",
  },
});
