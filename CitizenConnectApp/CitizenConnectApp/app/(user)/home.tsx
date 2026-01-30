import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Home() {
  const router = useRouter();

  const actions = [
    {
      title: "Report an Issue",
      icon: "alert-circle-outline",
      color1: "#2563EB",
      color2: "#3B82F6",
      route: "/(user)/complaint",
    },
    {
      title: "Track Complaints",
      icon: "map-outline",
      color1: "#10B981",
      color2: "#34D399",
      route: "/(user)/tracking",
    },
    {
      title: "View Notifications",
      icon: "notifications-outline",
      color1: "#F59E0B",
      color2: "#FBBF24",
      route: "/(user)/notifications",
    },
  ];

  return (
    <LinearGradient
      colors={["#e0f2fe", "#f9fafb", "#ffffff"]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Welcome to</Text>
          <Text style={styles.brand}>Citizen Connect 👋</Text>
          <Text style={styles.subtitle}>
            Empower your city by reporting and tracking issues easily.
          </Text>
        </View>

        <View style={styles.actionContainer}>
          {actions.map((item, index) => (
            <LinearGradient
              key={index}
              colors={[item.color1, item.color2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.touch}
                onPress={() => router.push(item.route)}
              >
                <MaterialCommunityIcons name={item.icon} size={32} color="#fff" />
                <Text style={styles.cardText}>{item.title}</Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  heading: {
    fontSize: 22,
    color: "#1E3A8A",
    fontWeight: "600",
  },
  brand: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1E40AF",
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#475569",
    maxWidth: 300,
  },
  actionContainer: {
    gap: 18,
  },
  card: {
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  touch: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  cardText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 14,
  },
});
