// components/AppInput.tsx
import React from "react";
import { TextInput, StyleSheet, ViewStyle } from "react-native";

type Props = {
  placeholder?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  multiline?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export default function AppInput({ placeholder, value, onChangeText, multiline = false, style }: Props) {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      style={[styles.input, multiline ? styles.multiline : null, style]}
      placeholderTextColor="#666"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
