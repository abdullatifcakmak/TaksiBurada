import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const AltLogo = () => {
  const { theme, themeStyles } = useTheme();
  return (
      <View style={styles.altLogoContainer}>
        <Text style={[styles.altLogoText, { color: themeStyles[theme].textColor }]}>GL soft</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  altLogoContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  altLogoText: {
    fontSize: 16,
  },
});

export default AltLogo;