import { MD3LightTheme, MD3Theme } from "react-native-paper";

const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Base colors
    primary: "#6c3fb5", // purple (45% lightness)
    onPrimary: "#ffffff",
    primaryContainer: "#e9d7ff",
    onPrimaryContainer: "#21005d",

    // Surface colors
    background: "#ffffff", // base-100 white
    surface: "#fafafa", // base-200
    surfaceVariant: "#f2f2f2", // base-300
    onSurface: "#353945", // base-content dark
    onSurfaceVariant: "#535761",

    // Secondary (pink)
    secondary: "#e857a6",
    onSecondary: "#ffffff",
    secondaryContainer: "#fdd9ec",
    onSecondaryContainer: "#3e0028",

    // Tertiary/Accent (cyan)
    tertiary: "#5ac5c3",
    onTertiary: "#005e5f",
    tertiaryContainer: "#c7f3f3",
    onTertiaryContainer: "#002e2f",

    // Error colors
    error: "#d14949",
    onError: "#ffffff",
    errorContainer: "#ffdad6",
    onErrorContainer: "#410002",
  },
};

export default lightTheme;
