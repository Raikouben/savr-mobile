import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState, useMemo } from "react";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { useTransactionQuery } from "@/hooks/queries/transactionQuery";
import { useUserQuery } from "@/hooks/queries/authQuery";
import {
  calculateBudgetSummary,
  calculateTotalBudgetComparison,
} from "../../utils/calculation";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { budgetCategories } from "../../constants/config";
import { Ionicons } from "@expo/vector-icons";
import { categoryIcons } from "../../constants/config";
import { AdviceModal } from "../../components/Advice";

export default function Page() {
  const { budget, isLoading: budgetLoading } = useBudgetQuery();
  const { transactions, isLoading: transactionsLoading } =
    useTransactionQuery();

  const [adviceModalVisible, setAdviceModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    category: string;
    budgetAmount: number;
    actualSpent: number;
  } | null>(null);

  const loading = budgetLoading || transactionsLoading;

  const budgetSummary = useMemo(() => {
    if (!budget || !transactions) return null;
    return calculateBudgetSummary(budget, transactions);
  }, [budget, transactions]);

  const overview = useMemo(() => {
    if (!budget || !transactions) return null;
    return calculateTotalBudgetComparison(budget, transactions);
  }, [budget, transactions]);

  return (
    <ScrollView>
      <Text>Overall Budget</Text>
      {loading && (
        <View>
          <ActivityIndicator size="large" />
          <Text>Loading...</Text>
        </View>
      )}
      {!loading && (
        <>
          <View>
            <Text>{`£${overview ? overview.totalSpent.toFixed(0) : "0.00"} / £${
              overview ? overview.totalBudget.toFixed(0) : "0.00"
            }`}</Text>
            <AnimatedCircularProgress
              size={200}
              width={12}
              fill={
                overview && overview.totalBudget > 0
                  ? Math.min(
                      (overview.totalSpent / overview.totalBudget) * 100,
                      100
                    )
                  : 0
              }
              tintColor={
                overview && overview.totalBudget > 0
                  ? overview.totalSpent / overview.totalBudget < 0.5
                    ? "#4caf50"
                    : overview.totalSpent / overview.totalBudget < 0.75
                    ? "#ffeb3b"
                    : overview.totalSpent / overview.totalBudget < 1
                    ? "#ff9800"
                    : "#e53935"
                  : "#4caf50"
              }
              backgroundColor="white"
            >
              {(fill: number) => (
                <Text style={{ color: "black", fontSize: 22 }}>{`${Math.round(
                  fill
                )}%`}</Text>
              )}
            </AnimatedCircularProgress>

            {budgetSummary && (
              <View>
                <Text>Budget by Category</Text>
                <View>
                  {Object.entries(budgetSummary).map(
                    ([category, data]: [string, any], index) => (
                      <TouchableOpacity
                        key={category}
                        onPress={() => {
                          setSelectedCategory({
                            category,
                            budgetAmount: data.budgetAmount,
                            actualSpent: data.actualSpent,
                          });
                          setAdviceModalVisible(true);
                        }}
                      >
                        <View>
                          <Text>
                            {category}{" "}
                            <Ionicons
                              name={
                                categoryIcons[
                                  category as keyof typeof categoryIcons
                                ] as any
                              }
                              size={24}
                              color="black"
                            />
                          </Text>
                          <AnimatedCircularProgress
                            size={100}
                            width={8}
                            fill={data.percentageUsed}
                            tintColor={
                              data.percentageUsed < 50
                                ? "#4caf50"
                                : data.percentageUsed < 75
                                ? "#ffeb3b"
                                : data.percentageUsed < 100
                                ? "#ff9800"
                                : "#e53935"
                            }
                            backgroundColor="#e0e0e0"
                          >
                            {(fill: number) => (
                              <Text>{`${Math.round(fill)}%`}</Text>
                            )}
                          </AnimatedCircularProgress>
                          <Text>
                            £{data.actualSpent.toFixed(0)} / £
                            {Number(data.budgetAmount).toFixed(0)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            )}
            {selectedCategory && (
              <AdviceModal
                visible={adviceModalVisible}
                onClose={() => {
                  setAdviceModalVisible(false);
                  setSelectedCategory(null);
                }}
                category={selectedCategory.category}
                budgetAmount={selectedCategory.budgetAmount}
                actualSpent={selectedCategory.actualSpent}
              />
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}
