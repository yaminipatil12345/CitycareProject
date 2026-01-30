import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import ScreenContainer from "../../components/ScreenContainer";
import { getDataAuth } from "../../services/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Tracking() {
  const [list, setList] = useState<any[]>([]);

  const load = async () => {
    try {
      const token = await AsyncStorage.getItem("access");
      const data = await getDataAuth("issues/user/", token!);
      setList(data.issues || []);
    } catch (error) {
      console.error("Failed to load complaints:", error);
      setList([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  return (
    <ScreenContainer>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>Track Complaints</Text>
      <FlatList
        data={list}
        keyExtractor={(item: any, index) => String(item.id ?? index)}
        renderItem={({ item }: any) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.problem}</Text>
            <Text style={styles.meta}>{item.problem_type} • {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</Text>
            <Text style={[styles.status, { color: item.status === "RESOLVED" ? "green" : item.status === "IN_PROGRESS" ? "orange" : "red" }]}>
              {item.status}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No complaints found</Text>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 10 },
  title: { fontWeight: "700" },
  meta: { color: "#666", marginTop: 6 },
  status: { marginTop: 8, fontWeight: "600" },
});
