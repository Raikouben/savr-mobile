import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import { useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { LineChart, PieChart, BarChart } from "react-native-gifted-charts";
import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useMemo } from "react";
import CategoryPicker from "@/components/CategoryPicker";
import { aggregateByTimeRange, formatChartLabel } from "@/utils/calculation";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { useTransactionQuery } from "@/hooks/queries/transactionQuery";
import { yAxisConfig, categoriseSpending } from "@/utils/analyticsHelper";
import { getCategoryDisplayName } from "@/constants/config";
import {
  ActivityIndicator,
  MD2Colors,
  Text,
  TextInput,
  Button,
  Card,
  List,
  TouchableRipple,
  Portal,
  Modal,
  Dialog,
  IconButton,
  ToggleButton,
  SegmentedButtons,
  Surface,
  Switch,
} from "react-native-paper";
import CategoryFilter from "@/components/CategoryFilter";
import { tr } from "react-native-paper-dates";
import { getDateRange } from "@/utils/calculation";
import { useAppTheme } from "@/themes/useAppTheme";
export default function analytics() {
  const { backgroundColor, primaryColor, secondaryColor, surfaceVariant } =
    useAppTheme();
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [category, setCategory] = useState<string>("");
  const [selectedMonthYear, setSelectedMonthYear] = useState<Date>(new Date());
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());

  // Comparison mode states
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareMonthYear, setCompareMonthYear] = useState<Date>(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
  );
  const [compareYear, setCompareYear] = useState<number>(
    new Date().getFullYear() - 1,
  );
  const [compareWeek, setCompareWeek] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 7)),
  );

  const { budget, isLoading: budgetLoading } = useBudgetQuery();
  const { transactions, isLoading: transactionsLoading } =
    useTransactionQuery();

  const resetFilters = () => {
    setTimeRange("week");
    setSelectedWeek(new Date());
    setSelectedMonthYear(new Date());
    setSelectedYear(new Date().getFullYear());
    setCategory("");
    setComparisonMode(false);
  };

  const loading = budgetLoading || transactionsLoading;

  const lineChartTransactions = useMemo(() => {
    if (!transactions) return [];
    if (category) {
      return transactions.filter((tx: any) => tx.category === category);
    }
    return transactions;
  }, [transactions, category]);

  // Comparison period transactions
  const compareStatisticsTransactions = useMemo(() => {
    if (!transactions || !comparisonMode) return [];

    let startDate: Date, endDate: Date;
    ({ startDate, endDate } = getDateRange(
      timeRange,
      timeRange === "month" ? compareMonthYear : undefined,
      timeRange === "year" ? compareYear : undefined,
      timeRange === "week" ? compareWeek : undefined,
    ));

    const filtered = transactions.filter((tx: any) => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= endDate;
    });

    if (category) {
      return filtered.filter((tx: any) => tx.category === category);
    }
    return filtered;
  }, [
    transactions,
    comparisonMode,
    timeRange,
    compareWeek,
    compareMonthYear,
    compareYear,
    category,
  ]);

  // const categoryChartTransactions = useMemo(() => {
  //   if (!transactions) return [];
  //   return transactions;
  // }, [transactions]);

  const chartData = useMemo(() => {
    const data = aggregateByTimeRange(
      lineChartTransactions,
      timeRange,
      timeRange === "month" ? selectedMonthYear : undefined,
      timeRange === "year" ? selectedYear : undefined,
      timeRange === "week" ? selectedWeek : undefined,
    );
    console.log("Final chart data:", data);
    return data;
  }, [
    lineChartTransactions,
    timeRange,
    selectedMonthYear,
    selectedYear,
    selectedWeek,
  ]);

  // Comparison chart data
  const compareChartData = useMemo(() => {
    if (!comparisonMode) return undefined;
    const data = aggregateByTimeRange(
      lineChartTransactions,
      timeRange,
      timeRange === "month" ? compareMonthYear : undefined,
      timeRange === "year" ? compareYear : undefined,
      timeRange === "week" ? compareWeek : undefined,
    );
    console.log("Comparison chart data:", data);
    return data;
  }, [
    comparisonMode,
    lineChartTransactions,
    timeRange,
    compareMonthYear,
    compareYear,
    compareWeek,
  ]);

  //CREATE A HELPER FUNCTIION THAT CAN BEU SED NI AGGREGATEbyTIMERANGE AND THIS ONE
  const categoryData = useMemo(() => {
    if (!transactions) return [];

    const { startDate, endDate } = getDateRange(
      timeRange,
      selectedMonthYear,
      selectedYear,
      selectedWeek,
    );

    const filteredTransactions = transactions.filter((tx: any) => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= endDate;
    });

    return categoriseSpending(filteredTransactions);
  }, [transactions, timeRange, selectedMonthYear, selectedYear, selectedWeek]);

  const pieChartData = useMemo(() => {
    return categoryData.map((item) => ({
      value: item.percentage,
      text: item.category,
      color: item.color,
    }));
  }, [categoryData]);

  const barChartData = useMemo(() => {
    return categoryData.map((item) => ({
      value: item.amount,
      label: getCategoryDisplayName(item.category), // Use first letter of display name
      frontColor: item.color,
    }));
  }, [categoryData]);

  const lineChartYAxisSettings = useMemo(() => {
    const maxValue1 =
      chartData.length > 0
        ? Math.max(...chartData.map((item) => item.value))
        : 0;
    if (!comparisonMode || !compareChartData) {
      return yAxisConfig(maxValue1);
    }
    const maxValue2 =
      compareChartData.length > 0
        ? Math.max(...compareChartData.map((item) => item.value))
        : 0;
    const maxValue = Math.max(maxValue1, maxValue2);
    return yAxisConfig(maxValue);
  }, [chartData, compareChartData, comparisonMode]);

  const barChartYAxisSettings = useMemo(() => {
    const maxValue =
      barChartData.length > 0
        ? Math.max(...barChartData.map((item) => item.value))
        : 0;
    return yAxisConfig(maxValue);
  }, [barChartData]);

  const getTimeRangeLabel = (isComparison = false) => {
    const week = isComparison ? compareWeek : selectedWeek;
    const monthYear = isComparison ? compareMonthYear : selectedMonthYear;
    const year = isComparison ? compareYear : selectedYear;

    if (timeRange === "week") {
      const weekDate = new Date(week);
      const dayOfWeek = weekDate.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const monday = new Date(weekDate);
      monday.setDate(weekDate.getDate() - daysToMonday);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      return `${monday.toLocaleDateString("en-UK", {
        month: "short",
        day: "numeric",
      })} - ${sunday.toLocaleDateString("en-UK", {
        month: "short",
        day: "numeric",
      })}`;
    } else if (timeRange === "month") {
      return monthYear.toLocaleDateString("en-UK", {
        month: "long",
        year: "numeric",
      });
    } else {
      return String(year);
    }
  };

  //ADD STATISTICS FOR COMPARISON MODE?
  const statistics = useMemo(() => {
    const { startDate, endDate } = getDateRange(
      timeRange,
      selectedMonthYear,
      selectedYear,
      selectedWeek,
    );
    const filteredTransactions = lineChartTransactions.filter((tx: any) => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= endDate;
    });
    const totalSpent = filteredTransactions.reduce(
      (sum: any, tx: any) => sum + Number(tx.amount),
      0,
    );
    const transactionCount = filteredTransactions.length;
    const averageTransaction =
      transactionCount > 0 ? totalSpent / transactionCount : 0;

    const categoryTotals: { [key: string]: number } = {};
    filteredTransactions.forEach((tx: any) => {
      const cat = tx.category;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(tx.amount);
    });

    const topCategoryEntry = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1],
    )[0];

    const topCategory = topCategoryEntry
      ? { category: topCategoryEntry[0], amount: topCategoryEntry[1] }
      : null;

    return { totalSpent, transactionCount, averageTransaction, topCategory };
  }, [
    lineChartTransactions,
    timeRange,
    selectedMonthYear,
    selectedYear,
    selectedWeek,
  ]);

  // Calculate comparison statistics
  const compareStatistics = useMemo(() => {
    if (!comparisonMode) return null;

    const totalSpent = compareStatisticsTransactions.reduce(
      (sum: any, tx: any) => sum + Number(tx.amount),
      0,
    );
    const transactionCount = compareStatisticsTransactions.length;
    const averageTransaction =
      transactionCount > 0 ? totalSpent / transactionCount : 0;

    const categoryTotals: { [key: string]: number } = {};
    compareStatisticsTransactions.forEach((tx: any) => {
      const cat = tx.category;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(tx.amount);
    });

    const topCategoryEntry = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1],
    )[0];

    const topCategory = topCategoryEntry
      ? { category: topCategoryEntry[0], amount: topCategoryEntry[1] }
      : null;

    return { totalSpent, transactionCount, averageTransaction, topCategory };
  }, [comparisonMode, compareStatisticsTransactions]);

  const navigatePrevious = () => {
    if (timeRange === "week") {
      const newDate = new Date(selectedWeek);
      newDate.setDate(newDate.getDate() - 7);
      setSelectedWeek(newDate);
    } else if (timeRange === "month") {
      const newDate = new Date(selectedMonthYear);
      newDate.setMonth(newDate.getMonth() - 1);
      setSelectedMonthYear(newDate);
    } else if (timeRange === "year") {
      setSelectedYear(selectedYear - 1);
    }
  };

  const navigateNext = () => {
    const now = new Date();
    if (timeRange === "week") {
      const newDate = new Date(selectedWeek);
      newDate.setDate(newDate.getDate() + 7);
      if (newDate <= now) {
        setSelectedWeek(newDate);
      }
    } else if (timeRange === "month") {
      const newDate = new Date(selectedMonthYear);
      newDate.setMonth(newDate.getMonth() + 1);
      if (newDate <= now) {
        setSelectedMonthYear(newDate);
      }
    } else if (timeRange === "year") {
      if (selectedYear < now.getFullYear()) {
        setSelectedYear(selectedYear + 1);
      }
    }
  };

  const canNavigateNext = () => {
    const now = new Date();
    if (timeRange === "week") {
      const nextWeek = new Date(selectedWeek);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek <= now;
    } else if (timeRange === "month") {
      const nextMonth = new Date(selectedMonthYear);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth <= now;
    } else if (timeRange === "year") {
      return selectedYear < now.getFullYear();
    }
    return false;
  };

  const navigateComparePrevious = () => {
    if (timeRange === "week") {
      const newDate = new Date(compareWeek);
      newDate.setDate(newDate.getDate() - 7);
      setCompareWeek(newDate);
    } else if (timeRange === "month") {
      const newDate = new Date(compareMonthYear);
      newDate.setMonth(newDate.getMonth() - 1);
      setCompareMonthYear(newDate);
    } else if (timeRange === "year") {
      setCompareYear(compareYear - 1);
    }
  };

  const navigateCompareNext = () => {
    if (timeRange === "week") {
      const newDate = new Date(compareWeek);
      newDate.setDate(newDate.getDate() + 7);
      setCompareWeek(newDate);
    } else if (timeRange === "month") {
      const newDate = new Date(compareMonthYear);
      newDate.setMonth(newDate.getMonth() + 1);
      setCompareMonthYear(newDate);
    } else if (timeRange === "year") {
      setCompareYear(compareYear + 1);
    }
  };
  const canNavigateCompareNext = () => {
    const now = new Date();
    if (timeRange === "week") {
      const nextWeek = new Date(compareWeek);
      nextWeek.setDate(nextWeek.getDate() + 7);

      return nextWeek < selectedWeek;
    } else if (timeRange === "month") {
      const nextMonth = new Date(compareMonthYear);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      return nextMonth < selectedMonthYear;
    } else if (timeRange === "year") {
      return compareYear < selectedYear;
    }
    return false;
  };
  const lineChartKey = useMemo(() => {
    const baseKey = `${comparisonMode ? "comparison" : "single"}-${timeRange}`;
    const currentDateKey =
      timeRange === "week"
        ? selectedWeek.getTime()
        : timeRange === "month"
          ? selectedMonthYear.getTime()
          : selectedYear;

    if (!comparisonMode) return `${baseKey}-${currentDateKey}`;

    const compareKey =
      timeRange === "week"
        ? compareWeek.getTime()
        : timeRange === "month"
          ? compareMonthYear.getTime()
          : compareYear;

    return `${baseKey}-${currentDateKey}-${compareKey}`;
  }, [
    comparisonMode,
    timeRange,
    selectedWeek,
    selectedMonthYear,
    selectedYear,
    compareWeek,
    compareMonthYear,
    compareYear,
  ]);

  useFocusEffect(
    React.useCallback(() => {
      setTimeRange("week");
      setSelectedWeek(new Date());
      setSelectedMonthYear(new Date());
      setSelectedYear(new Date().getFullYear());
      setCategory("");
    }, []),
  );

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 20,
        backgroundColor: backgroundColor,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>Analytics</Text>
      <Card style={{ padding: 12 }}>
        <SegmentedButtons
          value={timeRange}
          onValueChange={(value) =>
            setTimeRange(value as "week" | "month" | "year")
          }
          buttons={[
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "year", label: "Year" },
          ]}
        />

        {/* <Button mode="elevated" onPress={() => setCategory("")}>
        <Text>Clear Category Filter</Text>
      </Button> */}
        <Button
          style={{ marginTop: 8 }}
          mode="contained"
          onPress={resetFilters}
          compact
        >
          Reset
        </Button>
      </Card>

      {loading && <Text>Loading...</Text>}
      {error && <Text>{error}</Text>}

      <View style={{ gap: 20 }}>
        <Card style={{ padding: 16, overflow: "hidden" }}>
          <Card.Title
            title="Spending Over Time"
            titleStyle={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
            }}
          />
          <Card.Content>
            <View style={{ overflow: "hidden" }}>
              {chartData.some((item) => item.value > 0) ? (
                <LineChart
                  key={lineChartKey}
                  data={chartData}
                  data2={comparisonMode ? compareChartData : undefined}
                  // width={Dimensions.get("window").width - 72}
                  height={250}
                  spacing={
                    timeRange === "week" ? 40 : timeRange === "month" ? 14 : 36
                  }
                  initialSpacing={10}
                  color="transparent"
                  color2="transparent"
                  yAxisOffset={0}
                  yAxisLabelWidth={35}
                  thickness={3}
                  hideDataPoints={true}
                  disableScroll={false}
                  startFillColor={primaryColor}
                  endFillColor={primaryColor}
                  startFillColor2={secondaryColor}
                  endFillColor2={secondaryColor}
                  startOpacity={1}
                  endOpacity={0.5}
                  startOpacity2={1}
                  endOpacity2={0.5}
                  areaChart
                  yAxisColor="#ddd"
                  xAxisColor="transparent"
                  yAxisTextStyle={{ color: "#666", fontSize: 10 }}
                  xAxisLabelTextStyle={{ color: "#666", fontSize: 10 }}
                  rulesLength={Dimensions.get("window").width - 112}
                  rulesType="dotted"
                  yAxisThickness={0}
                  xAxisThickness={0}
                  animateOnDataChange={true}
                  animationDuration={1000}
                  onDataChangeAnimationDuration={300}
                  maxValue={lineChartYAxisSettings.maxValue}
                  stepValue={lineChartYAxisSettings.stepValue}
                  noOfSections={6}
                />
              ) : (
                <Text>No line chart data to display</Text>
              )}
            </View>
          </Card.Content>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>Comparison Mode</Text>
            <Switch value={comparisonMode} onValueChange={setComparisonMode} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <IconButton
              icon="chevron-left"
              onPress={navigatePrevious}
              size={20}
            />
            <Text
              variant="titleSmall"
              style={{ minWidth: 120, textAlign: "center" }}
            >
              {getTimeRangeLabel()}
            </Text>
            <IconButton
              icon="chevron-right"
              onPress={navigateNext}
              disabled={!canNavigateNext()}
              size={20}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 4,
                backgroundColor: primaryColor,
                padding: 8,
                borderRadius: 4,
              }}
            ></View>
          </View>
          {comparisonMode && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <IconButton
                icon="chevron-left"
                onPress={navigateComparePrevious}
                size={20}
              />
              <Text
                variant="titleSmall"
                style={{ minWidth: 120, textAlign: "center" }}
              >
                {getTimeRangeLabel(true)}
              </Text>
              <IconButton
                icon="chevron-right"
                onPress={navigateCompareNext}
                size={20}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 4,
                  backgroundColor: secondaryColor,
                  padding: 8,
                  borderRadius: 4,
                }}
              ></View>
            </View>
          )}
          <CategoryFilter
            selectedCategory={category}
            onCategoryChange={setCategory}
          />
          <View
            style={{
              padding: 8,
              backgroundColor: surfaceVariant,
              borderRadius: 4,
              marginTop: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "flex-start",
              }}
            >
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text variant="labelSmall" style={{ opacity: 0.7 }}>
                  Total Spent
                </Text>
                <Text variant="titleMedium">
                  £{statistics.totalSpent.toFixed(2)}
                </Text>
                {comparisonMode && compareStatistics && (
                  <View style={{ alignItems: "center" }}>
                    <Text
                      variant="bodySmall"
                      style={{
                        color:
                          compareStatistics.totalSpent > statistics.totalSpent
                            ? "#4CAF50"
                            : "#F44336",
                      }}
                    >
                      {compareStatistics.totalSpent > statistics.totalSpent
                        ? "↓"
                        : "↑"}
                      {Math.abs(
                        ((statistics.totalSpent -
                          compareStatistics.totalSpent) /
                          compareStatistics.totalSpent) *
                          100,
                      ).toFixed(1)}
                      % vs prev
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{
                        color:
                          compareStatistics.totalSpent > statistics.totalSpent
                            ? "#4CAF50"
                            : "#F44336",
                      }}
                    >
                      {compareStatistics.totalSpent > statistics.totalSpent
                        ? "↓"
                        : "↑"}
                      £
                      {Math.abs(
                        statistics.totalSpent - compareStatistics.totalSpent,
                      ).toFixed(2)}{" "}
                      vs prev
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  width: 1,
                  backgroundColor: "#e5e7eb",
                  alignSelf: "stretch",
                }}
              />
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text variant="labelSmall" style={{ opacity: 0.7 }}>
                  Transactions
                </Text>
                <Text variant="titleMedium">{statistics.transactionCount}</Text>
                {comparisonMode && compareStatistics && (
                  <Text
                    variant="bodySmall"
                    style={{
                      color:
                        statistics.transactionCount >
                        compareStatistics.transactionCount
                          ? "#F44336"
                          : "#4CAF50",
                    }}
                  >
                    {statistics.transactionCount >
                    compareStatistics.transactionCount
                      ? "↑"
                      : "↓"}
                    {Math.abs(
                      statistics.transactionCount -
                        compareStatistics.transactionCount,
                    )}{" "}
                    vs prev
                  </Text>
                )}
              </View>
            </View>
          </View>
        </Card>
      </View>
      {/* FIX SCREEN REPOSITION BECUASE OF PIE CAHRT*/}
      <View style={{ gap: 20 }}>
        <Card style={{ padding: 16, overflow: "hidden" }}>
          <Card.Title
            title="Proportion of Spending"
            titleStyle={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
            }}
          />
          <Card.Content style={{ alignItems: "center" }}>
            <View style={{ overflow: "hidden", alignItems: "center" }}>
              {categoryData.length > 0 ? (
                <PieChart
                  data={pieChartData}
                  donut
                  focusOnPress
                  radius={100}
                  innerRadius={50}
                />
              ) : (
                <Text>No category data to display</Text>
              )}
            </View>
            <View style={{ marginTop: 16, gap: 8 }}>
              {pieChartData.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      backgroundColor: item.color,
                      borderRadius: 4,
                    }}
                  />
                  <Text>
                    {getCategoryDisplayName(item.text)}: {item.value.toFixed(0)}
                    %
                  </Text>
                </View>
              ))}
            </View>
          </Card.Content>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <IconButton
              icon="chevron-left"
              onPress={navigatePrevious}
              size={20}
            />
            <Text
              variant="titleSmall"
              style={{ minWidth: 120, textAlign: "center" }}
            >
              {getTimeRangeLabel()}
            </Text>
            <IconButton
              icon="chevron-right"
              onPress={navigateNext}
              disabled={!canNavigateNext()}
              size={20}
            />
          </View>
        </Card>
        <Card style={{ padding: 16, overflow: "hidden" }}>
          <Card.Title
            title="Spending by Category"
            titleStyle={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
            }}
          />
          <Card.Content style={{ alignItems: "center" }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ overflow: "hidden", alignItems: "center" }}>
                {categoryData.length > 0 ? (
                  <BarChart
                    data={barChartData}
                    width={Math.max(
                      Dimensions.get("window").width - 72,
                      barChartData.length * 60,
                    )}
                    height={250}
                    barWidth={30}
                    spacing={28}
                    initialSpacing={10}
                    endSpacing={10}
                    yAxisThickness={0}
                    xAxisThickness={0}
                    yAxisLabelWidth={35}
                    yAxisTextStyle={{ color: "#666", fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: "#666", fontSize: 10 }}
                    yAxisColor="transparent"
                    xAxisColor="transparent"
                    maxValue={barChartYAxisSettings.maxValue}
                    stepValue={barChartYAxisSettings.stepValue}
                  />
                ) : (
                  <Text>No category data to display</Text>
                )}
              </View>
            </ScrollView>
          </Card.Content>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <IconButton
              icon="chevron-left"
              onPress={navigatePrevious}
              size={20}
            />
            <Text
              variant="titleSmall"
              style={{ minWidth: 120, textAlign: "center" }}
            >
              {getTimeRangeLabel()}
            </Text>
            <IconButton
              icon="chevron-right"
              onPress={navigateNext}
              disabled={!canNavigateNext()}
              size={20}
            />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
