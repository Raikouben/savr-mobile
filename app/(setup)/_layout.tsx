import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Redirect, Slot, Stack } from "expo-router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";

export default function Setup() {
  const budget = useBudgetQuery();

  if (budget) {
    console.log("Budget found, redirecting to main app");
    return <Redirect href={"/(tabs)"} />; // Done with setup, go to main app
  }
  console.log("In setup layout, no budget found");
  return <Stack screenOptions={{ headerShown: false }} />; // Stay in setup
}
