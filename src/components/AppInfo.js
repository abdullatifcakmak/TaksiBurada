import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AppInfo = ({ text }) => {
  return (
    <View style={styles.appInfoContainer}>
      <View style={styles.appInfoBackground}>
        <Text style={styles.appInfo}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appInfoContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 120,
  },
  appInfoBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    borderRadius: 10,
  },
  appInfo: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    marginBottom: 0,
  },
});

export default AppInfo;
