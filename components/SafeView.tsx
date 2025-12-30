import React, { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeView = ({ children }: { children: ReactNode }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: "black" }}>
      {children}
    </View>
  );
};

export default SafeView;
