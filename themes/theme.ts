import { MD3LightTheme, MD3Theme } from "react-native-paper";
import oceanTheme from "./oceanTheme";
import luxuryTheme from "./luxuryTheme";
import lightTheme from "./lightTheme";
import valentineTheme from "./valentineTheme";
import darkTheme from "./darkTheme";
import purpleTheme from "./purpleTheme";
// Themes are inspired by DaisyUI themes
//daisyui.com. (n.d.). daisyUI — Tailwind CSS Components. [online] Available at: https://daisyui.com/.

const coffeeTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: "#1e151d",
    surface: "#261b25",
    surfaceVariant: "#120a11",
    onSurface: "#c59f61",
    onSurfaceVariant: "#c59f61",

    primary: "#db924c",
    onPrimary: "#110802",
    primaryContainer: "#120c12",
    onPrimaryContainer: "#d0d5d5",

    secondary: "#273e3f",
    onSecondary: "#d0d5d5",
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
const velvetTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: "#f9e4f0", // base-200 - background
    surface: "#fcf2f8", // base-100 - card color
    surfaceVariant: "#e4c5d8", // base-300 - for cards on higher elevation no speicifc component
    onSurface: "#c5005a", // base-content - text on surface
    onSurfaceVariant: "#c5005a", // placeholder text

    primary: "#830c41", // primary - for contained buttons
    onPrimary: "#ffffff",
    primaryContainer: "#d14981", // FAB button
    onPrimaryContainer: "#ffffff",

    // Secondary colors (Purple)
    secondary: "#d14981", // secondary - purple
    onSecondary: "#fef7f0", // secondary-content - light
    secondaryContainer: "#d14981", //this is for highligting and contained-tonal buttons
    onSecondaryContainer: "#ffffff",

    // Neutral colors
    outline: "#d14981", // neutral
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

export default {
  oceanTheme,
  velvetTheme,
  coffeeTheme,
  luxuryTheme,
  lightTheme,
  valentineTheme,
  darkTheme,
  purpleTheme,
};
