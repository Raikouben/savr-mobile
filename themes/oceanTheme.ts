import { MD3LightTheme } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";

const oceanTheme: MD3Theme = {
  ...MD3LightTheme,
  dark: false,
  roundness: 2,
  version: 3,
  colors: {
    ...MD3LightTheme.colors,

    // Primary (Yellow)
    primary: "#E8C64A",
    onPrimary: "#4B3A1E",
    primaryContainer: "#F5E8A8",
    onPrimaryContainer: "#4B3A1E",

    // Secondary (Blue)
    secondary: "#6FB7D8",
    onSecondary: "#2C4555",
    secondaryContainer: "#B7DCF0",
    onSecondaryContainer: "#2C4555",

    // Tertiary/Accent (Green)
    tertiary: "#6FE36B",
    onTertiary: "#1E4A33",
    tertiaryContainer: "#B7F5B5",
    onTertiaryContainer: "#1E4A33",

    // Background & Surface (Base colors)
    background: "#E7EDF7", // base-100
    onBackground: "#2B3A63", // base-content

    surface: "#F5F8FC", // base-200
    onSurface: "#2B3A63",
    surfaceVariant: "#D5DFF0", // base-300
    onSurfaceVariant: "#2B3A63",
    surfaceDisabled: "rgba(43, 58, 99, 0.12)",
    onSurfaceDisabled: "rgba(43, 58, 99, 0.38)",

    // Error
    error: "#E04B6A",
    onError: "#4A1C22",
    errorContainer: "#F5C5D0",
    onErrorContainer: "#4A1C22",

    // Outline
    outline: "#2B3A63",
    outlineVariant: "#D5DFF0",

    // Inverse
    inverseSurface: "#2B3A63", // neutral
    inverseOnSurface: "#F5F8FC", // neutral-content
    inversePrimary: "#E8C64A",

    // Additional semantic colors
    backdrop: "rgba(43, 58, 99, 0.4)",

    elevation: {
      level0: "transparent",
      level1: "#F5F8FC", // base-100
      level2: "#E7EDF7", // base-200
      level3: "#D5DFF0", // base-300
      level4: "#CBD8EC",
      level5: "#C1D0E8",
    },

    shadow: "#2B3A63",
    scrim: "#2B3A63",
  },
};

export default oceanTheme;
