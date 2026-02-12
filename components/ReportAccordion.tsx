import { View, ScrollView, Dimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useReportQuery } from "@/hooks/queries/reportQuery";
import {
  ActivityIndicator,
  Text,
  Button,
  Card,
  Portal,
  Modal,
  Divider,
  List,
} from "react-native-paper";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { useAppTheme } from "@/themes/useAppTheme";
import PagerView from "react-native-pager-view";

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
  const { backgroundColor, textColor, textOnPrimary } = useAppTheme();
  const [expanded, setExpanded] = useState(true);
  const handlePress = () => setExpanded(!expanded);
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
          backgroundColor: backgroundColor,
          borderRadius: 12,
        }}
      >
        <ScrollView style={{ padding: 20 }}>
          <View>
            <Text
              variant="headlineMedium"
              style={{ fontWeight: "bold", marginBottom: 4 }}
            >
              Report - {period}
            </Text>
            <Text variant="bodySmall" style={{ marginBottom: 12 }}>
              Income: £{income}
            </Text>
          </View>
          <List.Section>
            <List.Accordion
              title="Financial Health"
              left={(props) => <List.Icon {...props} icon="folder" />}
            >
              <Card style={{ padding: 16 }}>
                <Text variant="bodySmall" style={{ lineHeight: 20 }}>
                  {insights?.overallFinancialHealth.summary}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ marginTop: 8, fontWeight: "bold", color: "green" }}
                >
                  Savings Rate:{" "}
                  {insights?.overallFinancialHealth.savingsRatePercent}%
                </Text>
              </Card>
            </List.Accordion>

            <List.Accordion
              title="Top Wins"
              left={(props) => <List.Icon {...props} icon="folder" />}
              expanded={expanded}
              onPress={handlePress}
            >
              <Card style={{ padding: 16 }}>
                {insights?.top3Wins.map((win, index) => (
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
              </Card>
            </List.Accordion>

            <List.Accordion
              title="Areas to Improve"
              left={(props) => <List.Icon {...props} icon="folder" />}
            >
              <List.Item title="First item" />
            </List.Accordion>
            <List.Accordion
              title="  Action Plan"
              left={(props) => <List.Icon {...props} icon="folder" />}
            >
              <List.Item title="First item" />
            </List.Accordion>
            <List.Accordion
              title="Summary"
              left={(props) => <List.Icon {...props} icon="folder" />}
            >
              <List.Item title="First item" />
            </List.Accordion>
          </List.Section>
        </ScrollView>
      </Modal>
    </Portal>
  );
}
