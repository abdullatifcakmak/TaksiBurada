import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const Input = ({ placeholder, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize }) => {
  const { theme, themeStyles } = useTheme();
  return (
      <TextInput
          style={[
            styles.input,
            {
              borderColor: themeStyles[theme].textColor,
              color: themeStyles[theme].textColor,
              backgroundColor: themeStyles[theme].cardColor,
            }
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize || 'sentences'}
          placeholderTextColor={theme === 'dark' ? '#bbb' : '#888'}
      />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default Input;