import { MD3LightTheme, MD3Theme } from "react-native-paper";

const coffeeTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    // Backgrounds
    background: "#241820", // slightly lighter than #1e151d
    surface: "#2a1f2b", // slightly brighter than #261b25
    surfaceVariant: "#1b1117", // keep depth but improve visibility
    onSurface: "#d1aa6b", // warmer gold for better contrast
    onSurfaceVariant: "#cfa56c",

    // Primary
    primary: "#e2a25e", // slightly brighter, more vibrant
    onPrimary: "#120801", // maintain contrast
    primaryContainer: "#1c1217", // subtle lift for container
    onPrimaryContainer: "#e5dad6",

    // Secondary
    secondary: "#2f5052", // slightly brighter teal-gray
    onSecondary: "#e0d7d6", // softer contrast
    secondaryContainer: "#2f5052",
    onSecondaryContainer: "#e0d7d6",

    // Neutral colors
    outline: "#324546", // slightly lighter for visibility
    outlineVariant: "#f0dfe1", // brighter content color

    // Status colors
    error: "#e15a5a", // slightly brighter red
    onError: "#fff6f1",
    errorContainer: "#ffdad6",
    onErrorContainer: "#5d0000",

    // Surface tints for elevation
    surfaceDisabled: "#f5edf2",
    onSurfaceDisabled: "#a2929a",

    // Backdrop for modals/overlays
    backdrop: "rgba(117, 81, 107, 0.5)", // slightly stronger for clarity

    // Elevation
    elevation: {
      level0: "transparent",
      level1: "#2a1f2b", // base-100
      level2: "#241820", // base-200
      level3: "#1b1117", // base-300
      level4: "#1c1217", // base-400
      level5: "#d19ab0", // base-500, brighter for visibility
    },
  },
};

export default coffeeTheme;
