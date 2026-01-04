import { View, Text } from "react-native";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useEffect } from "react";
import { useBudget } from "@/hooks/useBudget";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";

export default function profile() {
  const { user, isLoading: userLoading } = useUserQuery();
  const { budget, isLoading: budgetLoading } = useBudgetQuery();

  return (
    <View>
      <Text>profile</Text>
      {user && (
        <View>
          <Text>Username: {user.username}</Text>
          <Text>Email: {user.email}</Text>
          {budget && (
            <View>
              <Text>Total Budget: ${budget.total_budget}</Text>
              <Text>Housing: ${budget.housing}</Text>
              <Text>Utilities: ${budget.utilities}</Text>
              <Text>Transportation: ${budget.transportation}</Text>
              <Text>Food: ${budget.food}</Text>
              <Text>Shopping: ${budget.shopping}</Text>
              <Text>Health: ${budget.health}</Text>
              <Text>Entertainment: ${budget.entertainment}</Text>
              <Text>Miscellaneous: ${budget.miscellaneous}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
