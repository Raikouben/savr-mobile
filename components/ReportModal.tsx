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
  const { budget, isLoading: budgetLoading } = useBudgetQuery();
  const { backgroundColor, textColor, textOnPrimary } = useAppTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 5;
  const pagerRef = useRef(null);
  const screenHeight = Dimensions.get("window").height;
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
          <View>
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
            <PagerView
              ref={pagerRef}
              initialPage={0}
              onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
              style={{ height: screenHeight * 0.3 }}
            >
              <View key="1" collapsable={false}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Card>
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
                        style={{
                          marginTop: 8,
                          fontWeight: "bold",
                          color: "green",
                        }}
                      >
                        Savings Rate:{" "}
                        {insights.overallFinancialHealth.savingsRatePercent}%
                      </Text>
                    </Card.Content>
                  </Card>
                </ScrollView>
              </View>

              {/* Wins */}
              <View key="2" collapsable={false} style={{ flex: 1 }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ flex: 1 }}
                  contentContainerStyle={{
                    paddingBottom: 20,
                  }}
                >
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
                          <Text
                            variant="titleSmall"
                            style={{ fontWeight: "bold" }}
                          >
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
                </ScrollView>
              </View>

              <View key="3" collapsable={false} style={{ flex: 1 }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ flex: 1 }}
                  contentContainerStyle={{
                    paddingBottom: 20,
                  }}
                >
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
                          <Text
                            variant="titleSmall"
                            style={{ fontWeight: "bold" }}
                          >
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
                            Could save £
                            {area.potentialMonthlySavings.toFixed(0)}
                            /month
                          </Text>
                          {index <
                            insights.top3AreasForImprovement.length - 1 && (
                            <Divider style={{ marginTop: 12 }} />
                          )}
                        </View>
                      ))}
                    </Card.Content>
                  </Card>
                </ScrollView>
              </View>

              <View key="4" collapsable={false} style={{ flex: 1 }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ flex: 1 }}
                  contentContainerStyle={{
                    paddingBottom: 20,
                  }}
                >
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
                </ScrollView>
              </View>
              <View key="5" collapsable={false} style={{ flex: 1 }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ flex: 1 }}
                  contentContainerStyle={{
                    paddingBottom: 20,
                  }}
                >
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
                </ScrollView>
              </View>
            </PagerView>
            <View
              style={{
                paddingHorizontal: 20,
                paddingBottom: 10,
                paddingTop: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 10,
                }}
              >
                {Array.from({ length: totalPages }).map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: index === currentPage ? 10 : 8,
                      height: index === currentPage ? 10 : 8,
                      borderRadius: index === currentPage ? 5 : 4,
                      backgroundColor:
                        index === currentPage ? textColor : "#ccc",
                      marginHorizontal: 4,
                    }}
                  />
                ))}
              </View>
              <Button mode="contained" onPress={onClose}>
                Close
              </Button>
            </View>
          </View>
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
