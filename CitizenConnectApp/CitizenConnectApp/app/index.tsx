import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView, MotiText, MotiImage } from "moti";

export default function LandingPage() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 🔹 Header (Only App Name) */}
      <View style={styles.header}>
        <LinearGradient
          colors={["#e6f3ff", "#cce7ff"]}
          style={styles.headerGradient}
        />
        <MotiText
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 800 }}
          style={styles.appName}
        >
          CityCare
        </MotiText>
      </View>

      {/* 🔹 Welcome Section (Below Header) */}
      <View style={styles.welcomeSection}>
        <MotiText
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 700, delay: 200 }}
          style={styles.heading}
        >
          Welcome to
        </MotiText>

        <MotiText
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 700, delay: 300 }}
          style={styles.brand}
        >
          Citizen Connect 👋
        </MotiText>

        <MotiText
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 700, delay: 400 }}
          style={styles.subtitle}
        >
          Empower your city by reporting and tracking issues easily.
        </MotiText>
      </View>

      {/* 🔹 Cards Section */}
      <View style={styles.cardsContainer}>
        {[
          {
            img: require("../assets/spot.png"),
            title: "Spot an Issue",
            text: "Identify public issues like potholes or garbage.",
          },
          {
            img: require("../assets/report.png"),
            title: "Report Easily",
            text: "Share a photo & details in just a few taps.",
          },
          {
            img: require("../assets/progress.png"),
            title: "Track Progress",
            text: "Stay updated on issue resolution status.",
          },
        ].map((card, i) => (
          <MotiView
            key={i}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 700, delay: i * 150 }}
            style={styles.card}
          >
            <MotiImage
              source={card.img}
              style={styles.cardImg}
              from={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            />
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardText}>{card.text}</Text>
          </MotiView>
        ))}
      </View>

      {/* 🔹 Buttons */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", delay: 800 }}
        style={styles.buttonGroup}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/auth/login")}
          style={styles.fullButton}
        >
          <LinearGradient
            colors={["#417eefff", "#7666ebff"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/auth/signup")}
          style={styles.fullButton}
        >
          <LinearGradient
            colors={["#94dfeeff", "#79c9f1ff"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f9ff",
  },
  header: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  appName: {
    fontSize: 42,
    fontWeight: "700",
    color: "#003366",
  },

  // 🔹 New Welcome Section (Separate from header)
  welcomeSection: {
    marginTop: 25,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 18,
    color: "#00509e",
    marginTop: 5,
    textAlign: "center",
  },
  brand: {
    fontSize: 24,
    fontWeight: "700",
    color: "#004080",
    marginTop: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#4a6fa5",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
    maxWidth: 280,
  },

  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 25,
    paddingHorizontal: 10,
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginHorizontal: 5,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
  },
  cardImg: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 10,
    color: "#4e5db7ff",
  },
  cardText: {
    fontSize: 13,
    textAlign: "center",
    color: "#555",
    marginTop: 5,
  },
  buttonGroup: {
    marginHorizontal: 30,
    marginTop: 35,
    gap: 12,
  },
  fullButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
