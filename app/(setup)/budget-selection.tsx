import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter, Redirect } from "expo-router";
import { getCategoryDisplayName } from "../../constants/config";
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { useRecommender } from "@/hooks/useRecommender";
import { useBudget } from "@/hooks/useBudget";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { IconButton, MD2Colors } from "react-native-paper";
import {
  Text,
  TextInput,
  Button,
  Card,
  RadioButton,
  ActivityIndicator,
  Surface,
  Divider,
} from "react-native-paper";
import { useAppTheme } from "@/themes/useAppTheme";

export interface BudgetOverview {
  opening: string;
  insights: {
    category: string;
    explanation: string;
  }[];
  summary: string;
}

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
  const { backgroundColor, textOnPrimary, textColor, surfaceVariant } =
    useAppTheme();
  const {
    getBudgetRecommendation,
    loading: recommenderLoading,
    getRecommenderExplanation,
  } = useRecommender();
  const { createBudget, loading: budgetLoading } = useBudget();
  const { budget, isLoading: budgetQueryLoading } = useBudgetQuery();
  const [viewExplanation, setViewExplanation] = useState(false);
  const { user } = useUserQuery();
  const [explanation, setExplanation] = useState<BudgetOverview | null>(null);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [budgetValues, setBudgetValues] = useState<{ [key: string]: string }>(
    {},
  );
  const [isEditing, setIsEditing] = useState(false);
  const { edit } = useLocalSearchParams();

  // If setup is already complete (user has budget), redirect to tabs
  if (!budgetQueryLoading && budget && String(edit) !== "true") {
    return <Redirect href={"/(tabs)"} />;
  }

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
        // router.replace("/(setup)/income-disclosure");
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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: backgroundColor }}
      behavior="padding"
      keyboardVerticalOffset={60}
    >
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
        {viewExplanation && explanation ? (
          <Card
            style={[
              styles.explanationContainer,
              { width: "100%", backgroundColor: backgroundColor },
            ]}
          >
            <View style={styles.header}>
              <Text variant="titleLarge" style={styles.headerTitle}>
                Your Budget Explanation
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.pageScroll}
            >
              <Text variant="bodyMedium" style={styles.subtitle}>
                {explanation.opening}
              </Text>

              <Divider style={styles.divider} />

              {explanation.insights.map((insight, i) => (
                <View
                  key={i}
                  style={[styles.card, { backgroundColor: surfaceVariant }]}
                >
                  <Text variant="titleSmall" style={styles.tipTitle}>
                    {getCategoryDisplayName(insight.category)}
                  </Text>
                  <Text variant="bodySmall" style={styles.cardBody}>
                    {insight.explanation}
                  </Text>
                </View>
              ))}

              <Divider style={styles.divider} />

              <Text variant="bodyMedium" style={styles.subtitle}>
                {explanation.summary}
              </Text>
            </ScrollView>

            <View style={styles.footer}>
              <Button mode="contained" onPress={() => setViewExplanation(false)}>
                Back to Budget
              </Button>
            </View>
          </Card>
        ) : (
          <Card style={{ width: "100%" }}>
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
                {budgetLoading ? "Creating..." : "Accept Budget"}
              </Button>
              <Button
                mode="outlined"
                onPress={() => setViewExplanation(true)}
                disabled={!explanation}
              >
                View Explanation
              </Button>
            </Card.Actions>
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  explanationContainer: {
    borderRadius: 16,
    overflow: "hidden",
    paddingBottom: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontWeight: "bold",
  },
  subtitle: {
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  pageScroll: {
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    gap: 6,
    marginHorizontal: 16,
  },
  tipTitle: {
    fontWeight: "bold",
  },
  cardBody: {
    lineHeight: 18,
    opacity: 0.9,
  },
  divider: {
    opacity: 0.15,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
  },
});
