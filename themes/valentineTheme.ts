import { MD3LightTheme, MD3Theme } from "react-native-paper";

const velvetTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Base colors
    // base-100 card color
    // base-200 is background
    background: "#f9e4f0", // base-200 - background
    surface: "#fcf2f8", // base-100 - card color
    surfaceVariant: "#e4c5d8", // base-300
    onSurface: "#c5005a", // base-content
    onSurfaceVariant: "#f8f3fd",

    // Primary colors (Valentine pink/red)
    primary: "#830c41", // primary - valentine pink
    onPrimary: "#ffffff", // primary-content - white
    primaryContainer: "#d14981", // lighter variant of primary
    onPrimaryContainer: "#ffffff",

    // Secondary colors (Purple)
    secondary: "#d14981", // secondary - purple
    onSecondary: "#fef7f0", // secondary-content - light
    secondaryContainer: "#d14981",
    onSecondaryContainer: "#ffffff",

    // // Tertiary/Accent colors (Light blue)
    // tertiary: "#82bfff", // accent - light blue
    // onTertiary: "#1e3a5f", // accent-content - dark blue
    // tertiaryContainer: "#d4e8ff",
    // onTertiaryContainer: "#0c1e32",

    // Neutral colors
    outline: "#75516b", // neutral
    outlineVariant: "#e4c5d8", // neutral-content

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
      level1: "#fcf2f8", // base-100
      level2: "#f9e4f0", // base-200
      level3: "#e4c5d8", // base-300
      level4: "#d4a3c0", // base-400
      level5: "#c483a8", // base-500
    },
  },
};

export default velvetTheme;
