import React, { createContext, useContext, useState, ReactNode } from "react";
import { MD3Theme } from "react-native-paper";
import themes from "@/themes/theme";

type ThemeName =
  | "oceanTheme"
  | "velvetTheme"
  | "coffeeTheme"
  | "luxuryTheme"
  | "lightTheme"
  | "valentineTheme"
  | "darkTheme";

interface ThemeContextType {
  currentTheme: MD3Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>("coffeeTheme");

  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
  };

  const currentTheme = themes[themeName];

  return (
    <ThemeContext.Provider value={{ currentTheme, themeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
