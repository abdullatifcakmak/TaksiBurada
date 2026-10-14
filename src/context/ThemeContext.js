// src/context/ThemeContext.js
import React, { createContext, useState, useContext } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const themeStyles = {
    light: {
      backgroundColor: "#f0f0f0",
      textColor: "black",
      buttonColor: "#fcbd01",
      buttonTextColor: "white",
      cardColor: "#ffffff",
    },
    dark: {
      backgroundColor: "#222",
      textColor: "white",
      buttonColor: "#333",
      buttonTextColor: "white",
      cardColor: "#444",
    },
  };

  return (
      <ThemeContext.Provider value={{ theme, toggleTheme, themeStyles }}>
        {children}
      </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);