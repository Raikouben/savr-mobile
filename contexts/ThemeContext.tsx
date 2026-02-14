import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { MD3Theme } from "react-native-paper";
import themes from "@/themes/theme";
import * as SecureStore from "expo-secure-store";

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

const KEY = "savr_selected_theme";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>("coffeeTheme");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync(KEY);
        setThemeName((savedTheme as ThemeName) || "coffeeTheme");
      } catch (error) {
        console.error("Failed to load theme:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  const setTheme = async (ThemeName: ThemeName) => {
    setThemeName(ThemeName);
    try {
      await SecureStore.setItemAsync(KEY, ThemeName);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
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
