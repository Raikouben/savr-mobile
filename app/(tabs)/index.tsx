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

export default function Page() {
  const { budget, isLoading: budgetLoading } = useBudgetQuery();
  const { transactions, isLoading: transactionsLoading } =
    useTransactionQuery();
  const { reports } = useReportQuery();

  const [adviceModalVisible, setAdviceModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    category: string;
    budgetAmount: number;
    actualSpent: number;
  } | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  useEffect(() => {
    if (reports && reports.length > 0) {
      const unviewedReport = reports.find((report: any) => !report.viewed);
      if (unviewedReport) {
        setSelectedReportId(unviewedReport.id);
        setReportModalVisible(true);
      }
    }
  }, [reports]);

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
          {budgetSummary && (
            <View style={{ marginTop: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 10,
                  justifyContent: "space-between",
                }}
              >
                {Object.entries(budgetSummary).map(
                  ([category, data]: [string, any], index) => (
                    <TouchableRipple
                      key={category}
                      onPress={() => {
                        setSelectedCategory({
                          category,
                          budgetAmount: data.budgetAmount,
                          actualSpent: data.actualSpent,
                        });
                        setAdviceModalVisible(true);
                      }}
                      style={{ width: "48%" }}
                    >
                      <Card style={{ alignItems: "center" }}>
                        <List.Item
                          style={{ alignItems: "center" }}
                          title={getCategoryDisplayName(category)}
                          titleNumberOfLines={2}
                          left={() => (
                            <Ionicons
                              name={getCategoryIcon(category) as any}
                              size={24}
                              color="white"
                            />
                          )}
                        />
                        <Card.Content style={{ alignItems: "center", gap: 10 }}>
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
                        </Card.Content>
                      </Card>
                    </TouchableRipple>
                  ),
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
