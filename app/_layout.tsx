import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Redirect, Slot } from "expo-router";
import SafeView from "../components/SafeView";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { useTransactionQuery } from "@/hooks/queries/transactionQuery";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { ThemeProvider, useThemeContext } from "@/contexts/ThemeContext";
registerTranslation("en-GB", enGB);

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoading: userLoading } = useUserQuery();
  const { budget, isLoading: budgetLoading } = useBudgetQuery();
  const { isLoading: transactionsLoading } = useTransactionQuery();

  useEffect(() => {
    if (isLoaded && !userLoading && !budgetLoading && !transactionsLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded, userLoading, budgetLoading, transactionsLoading]);


  return (
    <SafeView>
      <Slot />
    </SafeView>
  );
}

function ThemedApp() {
  const { currentTheme } = useThemeContext();

  return (
    <PaperProvider theme={currentTheme}>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider tokenCache={tokenCache}>
          <RootLayoutNav />
        </ClerkProvider>
      </QueryClientProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}
