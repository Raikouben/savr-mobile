import { View, ScrollView, TouchableOpacity } from "react-native";
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

export default function profile() {
  const { user, isLoading: userLoading, updateUser } = useUserQuery();
  const { budget, isLoading: budgetLoading } = useBudgetQuery();
  const { getBudgetRecommendation } = useRecommender();
  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 20,
        backgroundColor: "#8a77aa",
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="headlineLarge">profile</Text>
      <UserDisplay />
      <BudgetDisplay />
      <Button
        mode="elevated"
        onPress={() => router.push("../(setup)/income-disclosure?edit=true")}
      >
        <Text>Updates to lifestyle</Text>
      </Button>
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
