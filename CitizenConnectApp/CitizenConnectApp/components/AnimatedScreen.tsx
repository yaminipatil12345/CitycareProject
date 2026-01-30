// components/AnimatedScreen.tsx
import React from "react";
import { StyleSheet } from "react-native";
import { MotiView } from "moti";

export default function AnimatedScreen({ children }: { children: React.ReactNode }) {
  return (
    <MotiView style={styles.container} from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 400 }}>
      {children}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
