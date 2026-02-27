import { MD3LightTheme, MD3Theme } from "react-native-paper";

const purpleTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: "#fae7ff", // base-200 - background
    surface: "#faf2fc", // base-100 - card color
    surfaceVariant: "#f5cefe", // base-300 - for cards on higher elevation no speicifc component
    onSurface: "#721377", // base-content - text on surface
    onSurfaceVariant: "#721377", // placeholder text

    primary: "#c4b3ff", // primary - for contained buttons
    onPrimary: "#2e0c67",
    primaryContainer: "#ffb667", // FAB button
    onPrimaryContainer: "#421104",

    // Secondary colors (Purple)
    secondary: "#ffb667", // secondary - purple
    onSecondary: "#421104", // secondary-content - light
    secondaryContainer: "#ffb667", //this is for highligting and contained-tonal buttons
    onSecondaryContainer: "#421104",

    // Neutral colors
    outline: "#890094", // neutral
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
      level1: "#faf2fc", // base-100
      level2: "#fae7ff", // base-200
      level3: "#f5cefe", // base-300
      level4: "#d4a3c0", // base-400
      level5: "#c483a8", // base-500
    },
  },
};

export default purpleTheme;
