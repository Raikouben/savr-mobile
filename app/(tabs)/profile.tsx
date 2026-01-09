import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useEffect } from "react";
import { useBudget } from "@/hooks/useBudget";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { useRouter } from "expo-router";
import BudgetDisplay from "@/components/BudgetDisplay";
import { SignOutButton } from "../../components/SignOutButton";
import UserDisplay from "@/components/UserDisplay";
import { useRecommender } from "@/hooks/useRecommender";

export default function profile() {
  const { user, isLoading: userLoading, updateUser } = useUserQuery();
  const { budget, isLoading: budgetLoading } = useBudgetQuery();
  const { getBudgetRecommendation } = useRecommender();
  const router = useRouter();

  return (
    <ScrollView>
      <Text>profile</Text>
      <UserDisplay />
      <BudgetDisplay />
      <TouchableOpacity
        onPress={() => router.push("../(setup)/lifestyle-survey")}
      >
        <Text>Updates to lifestyle </Text>
      </TouchableOpacity>
      <TouchableOpacity
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
      </TouchableOpacity>
      <SignOutButton />
    </ScrollView>
  );
}
