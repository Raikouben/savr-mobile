import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getCategoryDisplayName } from "../../constants/config";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useRecommender } from "@/hooks/useRecommender";
import { useBudget } from "@/hooks/useBudget";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { IconButton, MD2Colors } from "react-native-paper";
import {
  Text,
  TextInput,
  Button,
  Card,
  RadioButton,
  ActivityIndicator,
  Surface,
} from "react-native-paper";
import { useAppTheme } from "@/themes/useAppTheme";

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
  const { backgroundColor, textOnPrimary, textColor } = useAppTheme();
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
    {},
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
          data.meta,
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
        router.replace("/(setup)/income-disclosure");
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

  const calculateRemaining = () => {
    const income = parseFloat(user?.income || "0");
    const total = calculateTotal();
    return income - total;
  };

  const handleAcceptBudget = async () => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
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
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundColor: backgroundColor,
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16, color: textColor }}>
          Loading your personalized budget...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 20,
        backgroundColor: backgroundColor,
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
      showsVerticalScrollIndicator={false}
    >
      {!viewExplanation && explanation ? (
        <Card>
          <Card.Title
            title={isEditing ? "Edit Budget" : "Budget Overview"}
            titleStyle={{
              fontSize: 18,
              fontWeight: "bold",
            }}
            right={(props) => (
              <IconButton
                {...props}
                icon={isEditing ? "close" : "pencil"}
                onPress={() => setIsEditing(!isEditing)}
              />
            )}
          />
          <Card.Content>
            {user?.income && (
              <Text variant="titleMedium" style={{ marginBottom: 10 }}>
                Income: £{parseFloat(user.income)}
              </Text>
            )}
            <Text variant="titleMedium" style={{ marginBottom: 10 }}>
              Total Allocated: £{calculateTotal().toFixed(2)}
            </Text>
            <Text
              variant="titleMedium"
              style={{
                marginBottom: 10,
                color: calculateRemaining() < 0 ? "#ff6b6b" : "#51cf66",
                fontWeight: "bold",
              }}
            >
              Remaining: £{calculateRemaining().toFixed(2)}
            </Text>

            {categories.map((category) => (
              <View key={category} style={{ marginBottom: 10 }}>
                {isEditing ? (
                  <TextInput
                    mode="outlined"
                    placeholder="Amount"
                    //THIS LABEL DOESNT IMMEDIATELY LOAD
                    label={getCategoryDisplayName(category)}
                    value={budgetValues[category]}
                    onChangeText={(text) =>
                      setBudgetValues({ ...budgetValues, [category]: text })
                    }
                    keyboardType="decimal-pad"
                    left={<TextInput.Affix text="£" />}
                  />
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: 8,
                    }}
                  >
                    <Text variant="bodyLarge">
                      {getCategoryDisplayName(category)}
                    </Text>
                    <Text variant="bodyLarge" style={{ fontWeight: "600" }}>
                      £{parseFloat(budgetValues[category] || "0").toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={handleAcceptBudget}
              disabled={budgetLoading}
            >
              <Text style={{ color: textOnPrimary, fontWeight: "bold" }}>
                {budgetLoading ? "Creating..." : "Accept Budget"}
              </Text>
            </Button>
            <Button
              mode="outlined"
              onPress={() => setViewExplanation(!viewExplanation)}
            >
              <Text style={{ color: textColor, fontWeight: "bold" }}>
                View Explanation
              </Text>
            </Button>
          </Card.Actions>
        </Card>
      ) : (
        <Card>
          <Card.Title title="Budget Explanation" />
          <Card.Content>
            <Text>{explanation}</Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => setViewExplanation(!viewExplanation)}
            >
              <Text style={{ color: textOnPrimary, fontWeight: "bold" }}>
                Back to Budget
              </Text>
            </Button>
          </Card.Actions>
        </Card>
      )}
    </ScrollView>
  );
}
