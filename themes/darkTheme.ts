import { MD3LightTheme } from "react-native-paper";

const customTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#624FA8", // 500 - base color
    primaryContainer: "#8a77aa", // 300 - lighter
    onPrimaryContainer: "#e6e0f5", // 100 - very light
    onPrimary: "#ffffff",
    background: "#fffbfe",
    surface: "#fffbfe",
    surfaceVariant: "#e7e0ec",
    error: "#b3261e",
  },
};

export default customTheme;
