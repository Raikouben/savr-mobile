import React, { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/themes/useAppTheme";

// A wrapper component that applies safe area insets and background color from theme
const SafeView = ({ children }: { children: ReactNode }) => {
  const insets = useSafeAreaInsets();
  const { backgroundColor } = useAppTheme();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor }}>
      {children}
    </View>
  );
};

export default SafeView;
