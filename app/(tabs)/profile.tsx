import { View, Text } from "react-native";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useEffect } from "react";
import { useBudget } from "@/hooks/useBudget";

export default function profile() {
  const { updateUser } = useAuth();
  const { getUser } = useAuth();
  const { updateBudget } = useBudget();
  const { getBudget } = useBudget();
  const [user, setUser] = useState<any>(null);
  const [budget, setBudget] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
        const budgetData = await getBudget();
        setBudget(budgetData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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
