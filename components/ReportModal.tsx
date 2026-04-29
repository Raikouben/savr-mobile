import { View, ScrollView, Dimensions, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useReportQuery } from "@/hooks/queries/reportQuery";
import {
  ActivityIndicator,
  Text,
  Button,
  Portal,
  Modal,
  Divider,
  ProgressBar,
} from "react-native-paper";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { useAppTheme } from "@/themes/useAppTheme";
import PagerView from "react-native-pager-view";

export interface ReportInsights {
  howAmIGoing: {
    title: string;
    overallAssessment: string;
    wins: Array<{
      category: string;
      achievement: string;
      savingsAmount: number;
      savingsPercentage: number;
      strengthDemonstrated: string;
    }>;
    growthOpportunities: Array<{
      category: string;
      observation: string;
      potentialImpact: string;
      strengthToLeverage: string;
    }>;
  };
  whereToNext: {
    title: string;
    intro: string;
    actions: Array<{
      action: string;
      category: string;
      priority: string;
      expectedImpact: string;
      strengthToLeverage: string;
    }>;
    motivationalClose: string;
  };
  whereAmIGoing: {
    title: string;
    summary: string;
    keyGoals: string[];
    overallProgress: string;
  };
  budgetAdjustmentRecommendations: Array<{
    category: string;
    recommendation: string;
  }>;
}

const TOTAL_PAGES = 4;
const PAGE_LABELS = [
  "Your Progress This Month",
  "Your Action Plan",
  "Your Financial Goals",
  "Budget",
];

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
  const start = report?.start_date.split("T")[0].slice(5);
  const end = report?.end_date.split("T")[0].slice(5);
  const {
    backgroundColor,
    surfaceColor,
    surfaceVariant,
    primaryColor,
    secondaryColor,
    accentColor,
    successColor,
    warningColor,
    errorColor,
    infoColor,
    textColor,
    textSecondaryColor,
    textOnPrimary,
    textOnSecondary,
    backdrop,
  } = useAppTheme();

  const [currentPage, setCurrentPage] = useState(0);
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
          marginHorizontal: 16,
          borderRadius: 16,
          overflow: "hidden",
          paddingBottom: 8,
          backgroundColor: backgroundColor,
        }}
      >
        {isLoading ? (
          <View
            style={{
              flex: 1,
              backgroundColor: backgroundColor,
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <ActivityIndicator size="large" />

            <Text style={{ color: textColor }}>Generating your report...</Text>
          </View>
        ) : error ? (
          <View>
            <Text variant="titleMedium">Error loading report</Text>
            <Button onPress={() => refetch()} mode="contained">
              Retry
            </Button>
          </View>
        ) : insights ? (
          <View>
            <View style={styles.header}>
              <Text variant="titleLarge" style={styles.headerTitle}>
                {period}
              </Text>
              <Text variant="titleMedium">
                {start} to {end}
              </Text>
              <Text variant="bodySmall" style={styles.mutedText}>
                Income: £{income}
              </Text>
            </View>

            <View style={styles.pageLabelRow}>
              <Text variant="titleSmall" style={{ fontWeight: "700" }}>
                {PAGE_LABELS[currentPage]}
              </Text>
              <Text variant="bodySmall" style={styles.mutedText}>
                {currentPage + 1} / {TOTAL_PAGES}
              </Text>
            </View>

            <PagerView
              ref={pagerRef}
              initialPage={0}
              onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
              style={{ height: screenHeight * 0.48 }}
            >
              {/*Your Progress This Month */}
              <View key="1" collapsable={false}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.pageScroll}
                >
                  <Text variant="bodySmall" style={styles.cardBody}>
                    {insights.howAmIGoing.overallAssessment}
                  </Text>
                  {insights.howAmIGoing.wins.length > 0 && (
                    <Text variant="titleSmall" style={styles.headerTitle}>
                      Wins
                    </Text>
                  )}
                  {insights.howAmIGoing.wins.map((win, i) => (
                    <View
                      key={i}
                      style={{
                        borderRadius: 20,
                        padding: 12,
                        backgroundColor: surfaceVariant,
                      }}
                    >
                      <View style={styles.rowBetween}>
                        <Text style={[styles.chipText, { color: textColor }]}>
                          {win.category}
                        </Text>
                        {/* </View> */}
                        <Text style={[styles.amountText, { color: "#2abb5f" }]}>
                          £{win.savingsAmount} saved
                        </Text>
                      </View>
                      <Text variant="bodySmall" style={styles.cardBody}>
                        Achievement: {win.achievement}
                      </Text>

                      <Text variant="bodySmall" style={styles.cardBody}>
                        Strength Demonstrated: {win.strengthDemonstrated}
                      </Text>
                    </View>
                  ))}

                  {insights.howAmIGoing.growthOpportunities.length > 0 && (
                    <Text variant="titleSmall" style={styles.headerTitle}>
                      Growth Opportunities
                    </Text>
                  )}

                  {insights.howAmIGoing.growthOpportunities.map((opp, i) => (
                    <View
                      key={i}
                      style={{
                        borderRadius: 20,
                        padding: 12,
                        backgroundColor: surfaceVariant,
                      }}
                    >
                      <View style={styles.rowBetween}>
                        <Text style={[styles.chipText, { color: textColor }]}>
                          {opp.category}
                        </Text>
                      </View>
                      <Text variant="bodySmall" style={styles.cardBody}>
                        Observation: {opp.observation}
                      </Text>
                      <Text variant="bodySmall" style={styles.cardBody}>
                        Strength to Leverage: {opp.strengthToLeverage}
                      </Text>
                      <View
                        style={{
                          borderRadius: 8,
                          padding: 10,
                          borderLeftWidth: 3,
                          borderLeftColor: secondaryColor,
                          borderRightWidth: 3,
                          borderRightColor: secondaryColor,
                        }}
                      >
                        <Text variant="bodySmall" style={styles.hintText}>
                          {opp.potentialImpact}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* Your Action Plan */}
              <View key="2" collapsable={false}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.pageScroll}
                >
                  <Text variant="bodySmall" style={styles.cardBody}>
                    {insights.whereToNext.intro}
                  </Text>

                  {insights.whereToNext.actions.map((action, i) => (
                    <View
                      key={i}
                      style={{
                        borderRadius: 20,
                        padding: 12,
                        backgroundColor: surfaceVariant,
                      }}
                    >
                      <View style={styles.rowBetween}>
                        <Text style={[styles.chipText, { color: textColor }]}>
                          {action.category}
                        </Text>
                        {/* </View> */}
                        <View
                          style={[
                            styles.chip,
                            { backgroundColor: "#f43f5e20" },
                          ]}
                        >
                          <Text style={[styles.chipText, { color: "#f43f5e" }]}>
                            {action.priority}
                          </Text>
                        </View>
                      </View>
                      <Text variant="bodySmall" style={styles.cardBody}>
                        Impact: {action.expectedImpact}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={[styles.cardBody, { fontWeight: "bold" }]}
                      >
                        Action: {action.action}
                      </Text>
                      <Text variant="bodySmall" style={styles.cardBody}>
                        Impact: {action.expectedImpact}
                      </Text>
                      <View
                        style={{
                          borderRadius: 8,
                          padding: 10,
                          borderLeftWidth: 3,
                          borderLeftColor: secondaryColor,
                          borderRightWidth: 3,
                          borderRightColor: secondaryColor,
                        }}
                      >
                        <Text variant="bodySmall" style={styles.hintText}>
                          {action.strengthToLeverage}
                        </Text>
                      </View>
                    </View>
                  ))}

                  <View>
                    <Text variant="bodySmall" style={styles.hintText}>
                      {insights.whereToNext.motivationalClose}
                    </Text>
                  </View>
                </ScrollView>
              </View>

              {/*Your Financial Goals*/}
              <View key="3" collapsable={false}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.pageScroll}
                >
                  <Text variant="bodySmall" style={styles.cardBody}>
                    {insights.whereAmIGoing.summary}
                  </Text>

                  <Text variant="titleSmall" style={styles.headerTitle}>
                    Key Goals
                  </Text>

                  {insights.whereAmIGoing.keyGoals.map((goal, i) => (
                    <View
                      key={i}
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: textColor,
                          width: 7,
                          height: 7,
                          borderRadius: 99,
                          marginTop: 6,
                          flexShrink: 0,
                        }}
                      />
                      <Text variant="bodySmall" style={{ flex: 1 }}>
                        {goal}
                      </Text>
                    </View>
                  ))}

                  <Divider style={styles.divider} />

                  <Text variant="bodySmall" style={styles.mutedText}>
                    {insights.whereAmIGoing.overallProgress}
                  </Text>
                </ScrollView>
              </View>

              {/* Budget Adjustments */}
              <View key="4" collapsable={false}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.pageScroll}
                >
                  <Text variant="bodySmall" style={styles.cardBody}>
                    Based on this month's spending, here are some suggested
                    budget tweaks.
                  </Text>

                  {insights.budgetAdjustmentRecommendations.map((rec, i) => {
                    const isIncrease = rec.recommendation
                      .toLowerCase()
                      .includes("increase");
                    const accentColor = isIncrease ? "#2abb5f" : "#eb2424";
                    return (
                      <View
                        key={i}
                        style={{
                          borderRadius: 20,
                          padding: 12,
                          backgroundColor: surfaceVariant,
                        }}
                      >
                        <View style={styles.rowBetween}>
                          <Text
                            style={[styles.chipText, { color: accentColor }]}
                          >
                            {rec.category}
                          </Text>
                          {/* </View> */}
                          <Text
                            style={[styles.amountText, { color: accentColor }]}
                          >
                            {isIncrease ? "↑ Increase" : "↓ Reduce"}
                          </Text>
                        </View>
                        <Text variant="bodySmall" style={styles.cardBody}>
                          {rec.recommendation}
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </PagerView>

            <View style={styles.footer}>
              <View style={styles.dotsRow}>
                {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      {
                        width: i === currentPage ? 18 : 7,
                        backgroundColor:
                          i === currentPage ? textColor : textColor + "33",
                      },
                    ]}
                  />
                ))}
              </View>
              <Button mode="contained" onPress={onClose}>
                Close
              </Button>
            </View>
          </View>
        ) : (
          <View style={{ padding: 20, alignItems: "center", gap: 12 }}>
            <Text variant="bodyLarge">No insights available.</Text>
            <Button onPress={onClose} mode="outlined">
              Close
            </Button>
          </View>
        )}
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 },
  headerTitle: { fontWeight: "bold" },

  pageLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pageScroll: { paddingHorizontal: 16, paddingBottom: 24, gap: 10 },
  mutedText: { opacity: 0.55, lineHeight: 20 },

  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffffff14",
    backgroundColor: "#ffffff08",
    padding: 12,
    gap: 6,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  chip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  chipText: { fontSize: 12, fontWeight: "bold" },

  amountText: { fontSize: 13, fontWeight: "bold" },

  cardBody: { lineHeight: 18 },

  hintText: { lineHeight: 18, opacity: 0.7 },

  divider: { opacity: 0.15, marginVertical: 4 },

  footer: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 12, gap: 10 },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: { height: 7, borderRadius: 999 },
});
