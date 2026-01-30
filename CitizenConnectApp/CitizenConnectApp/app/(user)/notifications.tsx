// app/(user)/notifications.tsx
import React, { useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet, Alert } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDataAuth } from "../../services/apiClient";

export default function Notifications() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You must be logged in.");
        return;
      }
      const data = await getDataAuth("notifications/", token);
      setNotes(data.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      Alert.alert("Error", "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <ScreenContainer>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>
        Notifications
      </Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: "#666" }}>No notifications</Text>
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  title: { fontWeight: "700", fontSize: 16, marginBottom: 4 },
  message: { color: "#444", fontSize: 14 },
  time: { fontSize: 12, color: "#888", marginTop: 6 },
});
