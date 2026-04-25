import { useTheme } from "react-native-paper";

// custom hook to provide easy access to theme colors and properties throughout the app
export const useAppTheme = () => {
  const theme = useTheme();
  const colors = theme.colors as any;

  return {
    colors: theme.colors,
    backgroundColor: colors.background,
    surfaceColor: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    accentColor: colors.tertiary,
    successColor: colors.success,
    warningColor: colors.warning,
    errorColor: colors.error,
    infoColor: colors.info,
    textColor: colors.onSurface,
    textSecondaryColor: colors.onSurfaceVariant,
    textOnPrimary: colors.onPrimary,
    textOnSecondary: colors.onSecondary,
    backdrop: colors.backdrop,
  };
};
