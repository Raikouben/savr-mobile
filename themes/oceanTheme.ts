import { MD3LightTheme, MD3Theme } from "react-native-paper";

const velvetTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Base colors
    // base-100 card color
    // base-200 is background
    background: "#e0e7ff", // base-200 - background
    surface: "#edf1fe", // base-100 - card color
    surfaceVariant: "#c6d2ff", // base-300
    onSurface: "#2f2982", // base-content
    onSurfaceVariant: "#2f2982",

    // Primary colors (Valentine pink/red)
    primary: "#000000", // primary - valentine pink
    onPrimary: "#ffffff", // primary-content - white
    primaryContainer: "#8c4fff", // lighter variant of primary
    onPrimaryContainer: "#f2f0fc",

    // Secondary colors (Purple)
    secondary: "#8c4fff", // secondary - purple
    onSecondary: "#f2f0fc", // secondary-content - light
    secondaryContainer: "#8c4fff",
    onSecondaryContainer: "#f2f0fc",

    // // Tertiary/Accent colors (Light blue)
    // tertiary: "#82bfff", // accent - light blue
    // onTertiary: "#1e3a5f", // accent-content - dark blue
    // tertiaryContainer: "#d4e8ff",
    // onTertiaryContainer: "#0c1e32",

    // Neutral colors
    outline: "#3527a9", // neutral
    outlineVariant: "#90baff", // neutral-content

    // Status colors
    error: "#d14949", // error - red
    onError: "#fef7f0", // error-content - light
    errorContainer: "#ffdad6",
    onErrorContainer: "#410002",

    // Surface tints for elevation
    surfaceDisabled: "#f4ecf7",
    onSurfaceDisabled: "#9d8a95",

    // Backdrop for modals/overlays
    backdrop: "rgba(117, 81, 107, 0.4)",

    elevation: {
      level0: "transparent",
      level1: "#edf1fe", // base-100
      level2: "#e0e7ff", // base-200
      level3: "#c6d2ff", // base-300
      level4: "#d4a3c0", // base-400
      level5: "#c483a8", // base-500
    },
  },
};

export default velvetTheme;
