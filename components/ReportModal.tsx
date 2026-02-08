import { View, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { useReportQuery } from "@/hooks/queries/reportQuery";
import {
  ActivityIndicator,
  Text,
  Button,
  Card,
  Portal,
  Modal,
  Divider,
} from "react-native-paper";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";

//puit this in the constants file later
export interface ReportInsights {
  overallFinancialHealth: {
    summary: string;
    savingsRatePercent: number;
  };
  top3Wins: Array<{
    category: string;
    description: string;
    amountUnderBudget: number;
    percentUnderBudget: number;
  }>;
  top3AreasForImprovement: Array<{
    category: string;
    issue: string;
    recommendedAction: string;
    potentialMonthlySavings: number;
  }>;
  actionPlan: string[];
  motivationalClose: string;
}

export default function ReportModal({
  visible,
  onClose,
  reportId,
}: {
  visible: boolean;
  onClose: () => void;
  reportId: number;
}) {
  const { report, isLoading, error, refetch, markReportAsViewed } =
    useReportQuery(reportId);
  const insights: ReportInsights | null = report?.insights;
  const period = report?.period;
  const income = report?.income;
  const { budget, isLoading: budgetLoading } = useBudgetQuery();

  useEffect(() => {
    if (visible && report?.id && !report.viewed) {
      markReportAsViewed(report.id);
    }
  }, [visible, report?.id, report?.viewed, markReportAsViewed]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{
          padding: 10,
          margin: 20,
          backgroundColor: "#8a77aa",
          borderRadius: 12,
          maxHeight: "90%",
        }}
      >
        {isLoading ? (
          <View style={{ padding: 40 }}>
            <ActivityIndicator animating={true} size="large" />
          </View>
        ) : error ? (
          <View style={{ padding: 20 }}>
            <Text variant="titleMedium">Error loading report</Text>
            <Button
              onPress={() => refetch()}
              mode="contained"
              style={{ marginTop: 10 }}
            >
              Retry
            </Button>
          </View>
        ) : insights ? (
          <ScrollView style={{ padding: 20 }}>
            <Text
              variant="headlineMedium"
              style={{ fontWeight: "bold", marginBottom: 4 }}
            >
              Report - {period}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: "#666", marginBottom: 16 }}
            >
              Income: £{income}
            </Text>

            <Card style={{ marginBottom: 16 }}>
              <Card.Content>
                <Text
                  variant="titleMedium"
                  style={{ fontWeight: "bold", marginBottom: 8 }}
                >
                  Financial Health
                </Text>
                <Text variant="bodySmall" style={{ lineHeight: 20 }}>
                  {insights.overallFinancialHealth.summary}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ marginTop: 8, fontWeight: "bold", color: "green" }}
                >
                  Savings Rate:{" "}
                  {insights.overallFinancialHealth.savingsRatePercent}%
                </Text>
              </Card.Content>
            </Card>

            {/* Wins */}
            <Card style={{ marginBottom: 16 }}>
              <Card.Content>
                <Text
                  variant="titleMedium"
                  style={{ fontWeight: "bold", marginBottom: 12 }}
                >
                  Top Wins
                </Text>
                {insights.top3Wins.map((win, index) => (
                  <View key={index} style={{ marginBottom: 12 }}>
                    <Text variant="titleSmall" style={{ fontWeight: "bold" }}>
                      {win.category}
                    </Text>
                    <Text variant="bodySmall" style={{ lineHeight: 18 }}>
                      {win.description}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: "green", marginTop: 4 }}
                    >
                      Saved £{win.amountUnderBudget.toFixed(2)} (
                      {win.percentUnderBudget.toFixed(1)}%)
                    </Text>
                    {index < insights.top3Wins.length - 1 && (
                      <Divider style={{ marginTop: 12 }} />
                    )}
                  </View>
                ))}
              </Card.Content>
            </Card>

            <Card style={{ marginBottom: 16 }}>
              <Card.Content>
                <Text
                  variant="titleMedium"
                  style={{ fontWeight: "bold", marginBottom: 12 }}
                >
                  Areas to Improve
                </Text>
                {insights.top3AreasForImprovement.map((area, index) => (
                  <View key={index} style={{ marginBottom: 12 }}>
                    <Text variant="titleSmall" style={{ fontWeight: "bold" }}>
                      {area.category}
                    </Text>
                    <Text variant="bodySmall" style={{ lineHeight: 18 }}>
                      {area.issue}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ lineHeight: 18, marginTop: 4 }}
                    >
                      {area.recommendedAction}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: "orange", marginTop: 4 }}
                    >
                      Could save £{area.potentialMonthlySavings.toFixed(0)}
                      /month
                    </Text>
                    {index < insights.top3AreasForImprovement.length - 1 && (
                      <Divider style={{ marginTop: 12 }} />
                    )}
                  </View>
                ))}
              </Card.Content>
            </Card>

            <Card style={{ marginBottom: 16 }}>
              <Card.Content>
                <Text
                  variant="titleMedium"
                  style={{ fontWeight: "bold", marginBottom: 12 }}
                >
                  Action Plan
                </Text>
                {insights.actionPlan.map((action, index) => (
                  <Text
                    key={index}
                    variant="bodySmall"
                    style={{ lineHeight: 20, marginBottom: 8 }}
                  >
                    {index + 1}. {action}
                  </Text>
                ))}
              </Card.Content>
            </Card>

            <Card style={{ marginBottom: 16 }}>
              <Card.Content>
                <Text
                  variant="bodySmall"
                  style={{ lineHeight: 20, textAlign: "center" }}
                >
                  {insights.motivationalClose}
                </Text>
              </Card.Content>
            </Card>

            <Button
              mode="contained"
              onPress={onClose}
              style={{ marginBottom: 20 }}
            >
              Close
            </Button>
          </ScrollView>
        ) : (
          <View style={{ padding: 20 }}>
            <Text variant="bodyLarge">No insights available.</Text>
            <Button onPress={onClose} mode="outlined" style={{ marginTop: 10 }}>
              Close
            </Button>
          </View>
        )}
      </Modal>
    </Portal>
  );
}
