import { MD3DarkTheme, MD3Theme } from "react-native-paper";

const luxuryTheme: MD3Theme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    // Base colors
    primary: "#ffffff", // white
    onPrimary: "#333333",
    primaryContainer: "#5a3f7d", // secondary purple
    onPrimaryContainer: "#ddd7e6",

    // Surface colors
    background: "#232838", // base-100 dark
    surface: "#2f3a4d", // base-200
    surfaceVariant: "#3a4253", // base-300
    onSurface: "#eeebd9",
    onSurfaceVariant: "#b8b0c0",

    // Secondary (purple)
    secondary: "#5a3f7d",
    onSecondary: "#ddd7e6",
    secondaryContainer: "#7a5a9d",
    onSecondaryContainer: "#f0d9e6",

    // Tertiary/Accent (pink/red)
    tertiary: "#e63f6b",
    onTertiary: "#f0d9e1",
    tertiaryContainer: "#ff648f",
    onTertiaryContainer: "#fce6ec",

    // Error colors
    error: "#ff5a52",
    onError: "#fce6ec",
    errorContainer: "#93000a",
    onErrorContainer: "#ffdad6",
  },
};

export default luxuryTheme;
