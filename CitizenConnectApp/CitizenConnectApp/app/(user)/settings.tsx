// app/(user)/settings.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "settings_notifications_v1";

export default function Settings() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => { (async () => { const v = await AsyncStorage.getItem(KEY); if (v != null) setEnabled(v === "1"); })(); }, []);
  const toggle = async (val: boolean) => { setEnabled(val); await AsyncStorage.setItem(KEY, val ? "1" : "0"); };

  return (
    <ScreenContainer>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 20 }}>Settings</Text>
      <View style={styles.option}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Enable Notifications</Text>
        <Switch value={enabled} onValueChange={toggle} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  option: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: 14, borderRadius: 12 },
});
