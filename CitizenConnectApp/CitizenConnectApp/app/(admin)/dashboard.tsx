import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#E0F7FA", "#FFFFFF"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Admin Dashboard</Text>
        <Text style={styles.subHeader}>Manage and monitor city reports efficiently</Text>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(admin)/all-issues")}
          >
            <Ionicons name="list-circle" size={40} color="#2563EB" />
            <Text style={styles.cardTitle}>All Issues</Text>
            <Text style={styles.cardSubtitle}>View all submitted reports</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(admin)/manage-complaints")}
          >
            <Ionicons name="construct" size={40} color="#2563EB" />
            <Text style={styles.cardTitle}>Manage Complaints</Text>
            <Text style={styles.cardSubtitle}>Update issue status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(admin)/notifications")}
          >
            <Ionicons name="notifications" size={40} color="#2563EB" />
            <Text style={styles.cardTitle}>Notifications</Text>
            <Text style={styles.cardSubtitle}>Stay informed</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
  },
  subHeader: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  card: {
    backgroundColor: "#F8FAFC",
    width: "45%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginTop: 10,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
});
