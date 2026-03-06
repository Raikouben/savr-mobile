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
import { useColorScheme, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { ThemeProvider, useThemeContext } from "@/contexts/ThemeContext";
import { useReportQuery } from "@/hooks/queries/reportQuery";
import { useNotifications } from "@/hooks/useNotifications";
import { useSurveyQuery } from "@/hooks/queries/surveyQuery";
import { useSubscriptionQuery } from "@/hooks/queries/subscriptionQuery";
import { Text, ActivityIndicator } from "react-native-paper";
import { useAppTheme } from "@/themes/useAppTheme";
registerTranslation("en-GB", enGB);

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoading: userLoading } = useUserQuery();

  useNotifications();
  const { isLoading: budgetLoading } = useBudgetQuery();
  const { isLoading: transactionsLoading } = useTransactionQuery();
  const { isLoading: reportLoading } = useReportQuery();
  const { isLoading: surveyLoading } = useSurveyQuery();
  const { isLoading: subscriptionLoading } = useSubscriptionQuery();
  const { backgroundColor, textColor } = useAppTheme();

  const allLoaded =
    isLoaded &&
    !(
      isSignedIn &&
      (userLoading ||
        budgetLoading ||
        transactionsLoading ||
        reportLoading ||
        surveyLoading ||
        subscriptionLoading)
    );

  useEffect(() => {
    if (allLoaded) {
      SplashScreen.hideAsync();
    }
  }, [allLoaded]);

  // Keep Slot unmounted while loading so no route is evaluated yet.
  // The splash screen covers the screen during this time.
  if (!allLoaded)
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
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        tokenCache={tokenCache}
      >
        <QueryClientProvider client={queryClient}>
          <RootLayoutNav />
        </QueryClientProvider>
      </ClerkProvider>
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
