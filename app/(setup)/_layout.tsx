import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Redirect, Slot, Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";

export default function Setup() {
  const { budget } = useBudgetQuery();
  const { edit } = useLocalSearchParams();
  if (edit !== "true" && budget) {
    console.log("Budget found, redirecting to main app");
    return <Redirect href={"/(tabs)"} />;
  }

  console.log("In setup layout, no budget found");
  return <Stack screenOptions={{ headerShown: false }} />;
}
