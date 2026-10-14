import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const RadioButtonGroup = ({ options, selectedOption, onSelect }) => {
  const { theme, themeStyles } = useTheme();
  return (
      <View style={styles.uyeTipiContainer}>
        {options.map((option) => (
            <TouchableOpacity
                key={option.value}
                style={styles.radioButton}
                onPress={() => onSelect(option.value)}
            >
              <View
                  style={[
                    styles.radioButtonUnselected,
                    { borderColor: themeStyles[theme].textColor },
                    selectedOption === option.value
                        ? { backgroundColor: themeStyles[theme].buttonColor, borderColor: themeStyles[theme].buttonColor }
                        : null
                  ]}
              />
              <Text style={{ color: themeStyles[theme].textColor }}>{option.label}</Text>
            </TouchableOpacity>
        ))}
      </View>
  );
};

const styles = StyleSheet.create({
  uyeTipiContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 10,
    justifyContent: 'space-around',
    width: '80%',
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButtonUnselected: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 5,
  },

});

export default RadioButtonGroup;