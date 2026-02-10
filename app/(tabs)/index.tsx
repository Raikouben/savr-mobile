import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { View, ScrollView, TouchableOpacity } from "react-native";
import {
  ActivityIndicator,
  MD2Colors,
  Text,
  TextInput,
  Button,
  Card,
  List,
  TouchableRipple,
  Divider,
} from "react-native-paper";
import { useState, useMemo, useEffect } from "react";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { useTransactionQuery } from "@/hooks/queries/transactionQuery";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { useReportQuery } from "@/hooks/queries/reportQuery";
import ReportModal from "../../components/ReportModal";
import {
  calculateBudgetSummary,
  calculateTotalBudgetComparison,
} from "../../utils/calculation";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import {
  budgetCategories,
  getCategoryIcon,
  getCategoryDisplayName,
} from "../../constants/config";
import { Ionicons } from "@expo/vector-icons";
import { AdviceModal } from "../../components/Advice";

const categoryGroups = {
  "Essential Living": ["housing", "utilities", "groceries"],
  "Out & About": ["transportation", "eating_out"],
  Lifestyle: ["shopping", "health", "entertainment"],
  "Financial Management": ["savings", "debt"],
};

export default function Page() {
  const { budget, isLoading: budgetLoading } = useBudgetQuery();
  const { transactions, isLoading: transactionsLoading } =
    useTransactionQuery();
  const { reports } = useReportQuery();
  const { user, updateUserLoggedInfo } = useUserQuery();

  const [adviceModalVisible, setAdviceModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    category: string;
    budgetAmount: number;
    actualSpent: number;
  } | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      const today = new Date().toDateString();
      const lastLogged = user.last_logged
        ? new Date(user.last_logged).toDateString()
        : null;

      if (lastLogged !== today) {
        const newStreak = user.streak + 1;
        const newDaysLogged = user.days_logged + 1;

        updateUserLoggedInfo({
          last_logged: new Date().toISOString(),
          days_logged: newDaysLogged,
          streak: newStreak,
        }).catch((error) => {
          console.error("Failed to update logged info:", error);
        });
      }
    }
  }, [user]);

  const loading = budgetLoading || transactionsLoading;

  const budgetSummary = useMemo(() => {
    if (!budget || !transactions) return null;
    return calculateBudgetSummary(budget, transactions);
  }, [budget, transactions]);

  const overview = useMemo(() => {
    if (!budget || !transactions) return null;
    return calculateTotalBudgetComparison(budget, transactions);
  }, [budget, transactions]);

  const groupedBudgetSummary = useMemo(() => {
    if (!budgetSummary) return null;

    const grouped: Record<
      string,
      {
        categories: Array<{ name: string; data: any }>;
        totalBudget: number;
        totalSpent: number;
        percentageUsed: number;
      }
    > = {};

    Object.entries(categoryGroups).forEach(([groupName, categories]) => {
      const groupData = categories
        .map((cat) => ({
          name: cat,
          data: budgetSummary[cat],
        }))
        .filter((item) => item.data); // Only include categories that exist in budget

      if (groupData.length > 0) {
        const totalBudget = groupData.reduce(
          (sum, item) => sum + item.data.budgetAmount,
          0,
        );
        const totalSpent = groupData.reduce(
          (sum, item) => sum + item.data.actualSpent,
          0,
        );

        grouped[groupName] = {
          categories: groupData,
          totalBudget,
          totalSpent,
          percentageUsed:
            totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
        };
      }
    });

    return grouped;
  }, [budgetSummary]);

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
      <Text variant="headlineLarge">Budget Progress</Text>
      {loading && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <ActivityIndicator size="large" animating={true} />
        </View>
      )}
      {!loading && (
        <View>
          <Card
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <Card.Title title="Overall Budget Progress" />
            <Card.Content style={{ alignItems: "center", gap: 10 }}>
              <AnimatedCircularProgress
                size={200}
                width={12}
                fill={
                  overview && overview.totalBudget > 0
                    ? Math.min(
                        (overview.totalSpent / overview.totalBudget) * 100,
                        100,
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
                  <Text style={{ fontSize: 22 }}>{`${Math.round(fill)}%`}</Text>
                )}
              </AnimatedCircularProgress>
              <Text>{`£${
                overview ? overview.totalSpent.toFixed(0) : "0.00"
              } / £${
                overview ? overview.totalBudget.toFixed(0) : "0.00"
              }`}</Text>
            </Card.Content>
          </Card>
          {groupedBudgetSummary && (
            <View style={{ marginTop: 20, gap: 15 }}>
              {Object.entries(groupedBudgetSummary).map(
                ([groupName, groupData]) => (
                  <Card key={groupName}>
                    <Card.Title
                      title={groupName}
                      titleStyle={{ fontSize: 18, fontWeight: "bold" }}
                    />
                    <Card.Content style={{ gap: 15, alignItems: "center" }}>
                      <AnimatedCircularProgress
                        size={110}
                        width={10}
                        fill={Math.min(groupData.percentageUsed, 100)}
                        tintColor={
                          groupData.percentageUsed < 50
                            ? "#4caf50"
                            : groupData.percentageUsed < 75
                              ? "#ffeb3b"
                              : groupData.percentageUsed < 100
                                ? "#ff9800"
                                : "#e53935"
                        }
                        backgroundColor="#e0e0e0"
                      >
                        {(fill: number) => (
                          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                            {`${Math.round(fill)}%`}
                          </Text>
                        )}
                      </AnimatedCircularProgress>
                      <Text style={{ fontSize: 15, fontWeight: "500" }}>
                        £{groupData.totalSpent.toFixed(0)} / £
                        {groupData.totalBudget.toFixed(0)}
                      </Text>

                      <Divider style={{ width: "100%", marginVertical: 5 }} />

                      <View style={{ width: "100%", gap: 12 }}>
                        {groupData.categories.map(({ name, data }) => (
                          <View
                            key={name}
                            style={{
                              borderRadius: 8,
                              padding: 12,
                            }}
                          >
                            <View style={{ gap: 8 }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 10,
                                  }}
                                >
                                  <Ionicons
                                    name={getCategoryIcon(name) as any}
                                    size={24}
                                    color="#ffffff"
                                  />
                                  <Text
                                    style={{ fontSize: 15, fontWeight: "500" }}
                                  >
                                    {getCategoryDisplayName(name)}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                  }}
                                >
                                  <Text style={{ fontSize: 13, color: "#ffffff" }}>
                                    £{data.actualSpent.toFixed(0)} / £
                                    {Number(data.budgetAmount).toFixed(0)}
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() => {
                                      setSelectedCategory({
                                        category: name,
                                        budgetAmount: data.budgetAmount,
                                        actualSpent: data.actualSpent,
                                      });
                                      setAdviceModalVisible(true);
                                    }}
                                    style={{ padding: 4 }}
                                  >
                                    <Ionicons
                                      name="information-circle-outline"
                                      size={24}
                                      color="#ffffff"
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                              <View
                                style={{
                                  height: 8,
                                  backgroundColor: "#ffffff",
                                  borderRadius: 4,
                                  overflow: "hidden",
                                }}
                              >
                                <View
                                  style={{
                                    height: "100%",
                                    width: `${Math.min(data.percentageUsed, 100)}%`,
                                    backgroundColor:
                                      data.percentageUsed < 50
                                        ? "#4caf50"
                                        : data.percentageUsed < 75
                                          ? "#ffeb3b"
                                          : data.percentageUsed < 100
                                            ? "#ff9800"
                                            : "#e53935",
                                    borderRadius: 4,
                                  }}
                                />
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    </Card.Content>
                  </Card>
                ),
              )}
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
          {selectedReportId && (
            <ReportModal
              visible={reportModalVisible}
              onClose={() => {
                setReportModalVisible(false);
                setSelectedReportId(null);
              }}
              reportId={selectedReportId}
            />
          )}
        </View>
      )}
    </ScrollView>
  );
}
