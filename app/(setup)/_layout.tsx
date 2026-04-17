import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { ActivityIndicator, Text } from "react-native-paper";
import { View } from "react-native";
import { useAppTheme } from "@/themes/useAppTheme";

export default function Setup() {
  const { isLoaded, isSignedIn } = useAuth();
  const { budget, isLoading } = useBudgetQuery();
  const { backgroundColor, textColor } = useAppTheme();
  const { edit } = useLocalSearchParams();

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

  // If user is not authenticated, redirect to sign in
  if (!isSignedIn) {
    return <Redirect href={"/(auth)/sign-in"} />;
  }

  if (budget && String(edit) !== "true") {
    return <Redirect href={"/(tabs)"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
