import { View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useEffect } from "react";
import { useBudget } from "@/hooks/useBudget";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/themes/useAppTheme";
import BudgetDisplay from "@/components/BudgetDisplay";
import { SignOutButton } from "../../components/SignOutButton";
import UserDisplay from "@/components/UserDisplay";
import { useRecommender } from "@/hooks/useRecommender";
import {
  ActivityIndicator,
  MD2Colors,
  Text,
  TextInput,
  Button,
  Card,
  List,
  TouchableRipple,
  Portal,
  Modal,
  Dialog,
  IconButton,
  ToggleButton,
  SegmentedButtons,
  Surface,
} from "react-native-paper";
import ThemeSelector from "@/components/ThemeSelector";
import HistoricalReport from "@/components/HistoricalReport";

export default function profile() {
  const { backgroundColor, textOnPrimary, textColor } = useAppTheme();
  const { user, isLoading: userLoading, updateUser } = useUserQuery();
  const { budget, isLoading: budgetLoading } = useBudgetQuery();
  const { getBudgetRecommendation } = useRecommender();
  const router = useRouter();

  useEffect(() => {
    console.log("User data:", user);
    console.log("Streak value:", user?.streak);
    console.log("Days logged:", user?.days_logged);
    console.log("Last logged:", user?.last_logged);
  }, [user]);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 20,
        backgroundColor: backgroundColor,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>Profile</Text>
      <Text variant="bodyLarge">🔥 Streak: {user?.streak ?? 0} days</Text>
      <UserDisplay />
      <BudgetDisplay />
      <Button
        mode="contained"
        onPress={() => router.push("../(setup)/income-disclosure?edit=true")}
      >
        <Text style={{ color: textOnPrimary, fontWeight: "bold" }}>
          Updates to lifestyle
        </Text>
      </Button>
      <HistoricalReport />
      <ThemeSelector />
      {/* <TouchableOpacity
        onPress={async () => {
          try {
            const recommendation = await getBudgetRecommendation();
            console.log("Budget Recommendation:", recommendation);
          } catch (error) {
            console.error("Failed to get budget recommendation:", error);
          }
        }}
      >
        <Text>Get Budget Recommendation</Text>
      </TouchableOpacity> */}
      <SignOutButton />
    </ScrollView>
  );
}
