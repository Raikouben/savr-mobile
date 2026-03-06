import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { ActivityIndicator, Text } from "react-native-paper";
import { View } from "react-native";
import { useAppTheme } from "@/themes/useAppTheme";

export default function Setup() {
  const { isLoaded, isSignedIn } = useAuth();
  const { budget, isLoading } = useBudgetQuery();
  const { edit } = useLocalSearchParams();
  const { backgroundColor, textColor } = useAppTheme();

  if (!isLoaded || (isSignedIn && isLoading))
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <ActivityIndicator size="large" animating={true} />
        <Text style={{ color: textColor }}>Loading Data...</Text>
      </View>
    );

  if (edit !== "true" && budget) {
    return <Redirect href={"/(tabs)"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
