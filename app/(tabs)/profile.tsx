import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useEffect } from "react";
import { useBudget } from "@/hooks/useBudget";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import BudgetDisplay from "@/components/BudgetDisplay";
import { SignOutButton } from "../../components/SignOutButton";
import UserDisplay from "@/components/UserDisplay";

export default function profile() {
  const { user, isLoading: userLoading, updateUser } = useUserQuery();
  const { budget, isLoading: budgetLoading } = useBudgetQuery();

  return (
    <ScrollView>
      <Text>profile</Text>
      <UserDisplay />
      <BudgetDisplay />
      <SignOutButton />
    </ScrollView>
  );
}
