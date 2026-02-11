import { MD3LightTheme, MD3Theme } from "react-native-paper";

const coffeeTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Base colors
    // base-100 card color
    // base-200 is background
    background: "#1e151d", // base-200 - background
    surface: "#261b25", // base-100 - card color
    surfaceVariant: "#120a11", // base-300
    onSurface: "#c59f61", // base-content
    onSurfaceVariant: "#c59f61",

    // Primary colors (Valentine pink/red)
    primary: "#db924c", // primary - valentine pink
    onPrimary: "#110802", // primary-content - white
    primaryContainer: "#120c12", // lighter variant of primary
    onPrimaryContainer: "#d0d5d5",

    // Secondary colors (Purple)
    secondary: "#273e3f", // secondary - purple
    onSecondary: "#d0d5d5", // secondary-content - light
    secondaryContainer: "#273e3f", //this is for highligting and contained-tonal buttons
    onSecondaryContainer: "#d0d5d5",

    // Neutral colors
    outline: "#273e3f", // neutral
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
      level1: "#261b25", // base-100
      level2: "#1e151d", // base-200
      level3: "#120a11", // base-300
      level4: "#120c12", // base-400
      level5: "#c483a8", // base-500
    },
  },
};

export default coffeeTheme;
