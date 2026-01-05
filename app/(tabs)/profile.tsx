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

export default function profile() {
  const { user, isLoading: userLoading, updateUser } = useUserQuery();
  const { budget, isLoading: budgetLoading } = useBudgetQuery();
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
      <SignOutButton />
    </ScrollView>
  );
}
