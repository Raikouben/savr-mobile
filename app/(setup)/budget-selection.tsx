import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRecommender } from "@/hooks/useRecommender";
import { useBudget } from "@/hooks/useBudget";
import { useUserQuery } from "@/hooks/queries/authQuery";

const categories = [
  "housing",
  "utilities",
  "transportation",
  "groceries",
  "eating_out",
  "shopping",
  "health",
  "entertainment",
  "savings",
  "debt",
  "miscellaneous",
] as const;

export default function BudgetSelection() {
  const router = useRouter();
  const {
    getBudgetRecommendation,
    loading: recommenderLoading,
    getRecommenderExplanation,
  } = useRecommender();
  const { createBudget, loading: budgetLoading } = useBudget();
  const [viewExplanation, setViewExplanation] = useState(false);
  const { user } = useUserQuery();
  const [explanation, setExplanation] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [budgetValues, setBudgetValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const data = await getBudgetRecommendation();
        setRecommendation(data);
        const explanationText = await getRecommenderExplanation(
          parseFloat(user?.income || "0"),
          data.budget,
          data.meta
        );
        setExplanation(explanationText);

        if (data?.budget) {
          const budgetData = data.budget;
          const values: { [key: string]: string } = {};
          categories.forEach((cat) => {
            values[cat] = budgetData[cat]?.toString() || "0";
          });
          console.log("Setting budget values:", values);
          setBudgetValues(values);
        }
      } catch (error) {
        console.error("Error fetching budget recommendation:", error);
      }
    };

    fetchRecommendation();
  }, []);

  const calculateTotal = () => {
    return categories.reduce((sum, cat) => {
      return sum + parseFloat(budgetValues[cat] || "0");
    }, 0);
  };

  const handleAcceptBudget = async () => {
    try {
      const budgetData = {
        housing: parseFloat(budgetValues.housing || "0"),
        utilities: parseFloat(budgetValues.utilities || "0"),
        transportation: parseFloat(budgetValues.transportation || "0"),
        groceries: parseFloat(budgetValues.groceries || "0"),
        eating_out: parseFloat(budgetValues.eating_out || "0"),
        shopping: parseFloat(budgetValues.shopping || "0"),
        health: parseFloat(budgetValues.health || "0"),
        entertainment: parseFloat(budgetValues.entertainment || "0"),
        savings: parseFloat(budgetValues.savings || "0"),
        debt: parseFloat(budgetValues.debt || "0"),
        miscellaneous: parseFloat(budgetValues.miscellaneous || "0"),
        total_budget: calculateTotal(),
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 1))
          .toISOString()
          .split("T")[0],
      };

      await createBudget(budgetData);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Error creating budget:", error);
    }
  };

  if (recommenderLoading || !recommendation) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView>
      {viewExplanation && explanation ? (
        <View>
          <View>
            <Text>Budget Recommendation</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Text>{isEditing ? "Done" : "Edit"}</Text>
            </TouchableOpacity>
          </View>

          <Text>Total: £{calculateTotal().toFixed(2)}</Text>
          {user?.income && <Text>Income: £{parseFloat(user.income)}</Text>}

          {categories.map((category) => (
            <View key={category}>
              <Text>{category}</Text>
              {isEditing ? (
                <TextInput
                  value={budgetValues[category]}
                  onChangeText={(text) =>
                    setBudgetValues({ ...budgetValues, [category]: text })
                  }
                  keyboardType="decimal-pad"
                  placeholder="0"
                />
              ) : (
                <Text>£{parseFloat(budgetValues[category] || "0")}</Text>
              )}
            </View>
          ))}

          <TouchableOpacity
            onPress={handleAcceptBudget}
            disabled={budgetLoading}
          >
            <Text>{budgetLoading ? "Creating..." : "Accept Budget"}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text>Budget Explanation</Text>
        </View>
      )}
    </ScrollView>
  );
}
