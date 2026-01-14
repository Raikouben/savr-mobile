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
export default function analytics() {
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [category, setCategory] = useState<string>("");
  const [selectedMonthYear, setSelectedMonthYear] = useState<Date>(new Date());
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());

  // Comparison mode states
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareMonthYear, setCompareMonthYear] = useState<Date>(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [compareYear, setCompareYear] = useState<number>(
    new Date().getFullYear() - 1
  );
  const [compareWeek, setCompareWeek] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 7))
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
  const compareLineChartTransactions = useMemo(() => {
    if (!transactions || !comparisonMode) return [];

    let startDate: Date, endDate: Date;

    if (timeRange === "week") {
      const weekDate = new Date(compareWeek);
      const dayOfWeek = weekDate.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(weekDate);
      startDate.setDate(weekDate.getDate() - daysToMonday);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (timeRange === "month") {
      startDate = new Date(
        compareMonthYear.getFullYear(),
        compareMonthYear.getMonth(),
        1
      );
      endDate = new Date(
        compareMonthYear.getFullYear(),
        compareMonthYear.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
    } else {
      startDate = new Date(compareYear, 0, 1);
      endDate = new Date(compareYear, 11, 31, 23, 59, 59, 999);
    }

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

  const categoryChartTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions;
  }, [transactions]);

  const chartData = useMemo(() => {
    const data = aggregateByTimeRange(
      lineChartTransactions,
      timeRange,
      timeRange === "month" ? selectedMonthYear : undefined,
      timeRange === "year" ? selectedYear : undefined,
      timeRange === "week" ? selectedWeek : undefined
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
    if (!comparisonMode) return [];

    const data = aggregateByTimeRange(
      lineChartTransactions,
      timeRange,
      timeRange === "month" ? compareMonthYear : undefined,
      timeRange === "year" ? compareYear : undefined,
      timeRange === "week" ? compareWeek : undefined
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

  const categoryData = useMemo(() => {
    return categoriseSpending(categoryChartTransactions);
  }, [categoryChartTransactions]);

  const pieChartData = useMemo(() => {
    return categoryData.map((item, index) => ({
      value: item.percentage,
      text: item.category,
      color: item.color,
    }));
  }, [categoryData]);

  const barChartData = useMemo(() => {
    return categoryData.map((item, index) => ({
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
    const maxValue2 =
      compareChartData.length > 0
        ? Math.max(...compareChartData.map((item) => item.value))
        : 0;
    const maxValue = Math.max(maxValue1, maxValue2);
    return yAxisConfig(maxValue);
  }, [chartData, compareChartData]);

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
    const totalSpent = lineChartTransactions.reduce(
      (sum: any, tx: any) => sum + Number(tx.amount),
      0
    );
    const transactionCount = lineChartTransactions.length;
    const averageTransaction =
      transactionCount > 0 ? totalSpent / transactionCount : 0;

    const categoryTotals: { [key: string]: number } = {};
    lineChartTransactions.forEach((tx: any) => {
      const cat = tx.category;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(tx.amount);
    });

    const topCategoryEntry = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    )[0];

    const topCategory = topCategoryEntry
      ? { category: topCategoryEntry[0], amount: topCategoryEntry[1] }
      : null;

    return { totalSpent, transactionCount, averageTransaction, topCategory };
  }, [lineChartTransactions]);

  // Calculate comparison statistics
  const compareStatistics = useMemo(() => {
    if (!comparisonMode) return null;

    const totalSpent = compareLineChartTransactions.reduce(
      (sum: any, tx: any) => sum + Number(tx.amount),
      0
    );
    const transactionCount = compareLineChartTransactions.length;
    const averageTransaction =
      transactionCount > 0 ? totalSpent / transactionCount : 0;

    const categoryTotals: { [key: string]: number } = {};
    compareLineChartTransactions.forEach((tx: any) => {
      const cat = tx.category;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(tx.amount);
    });

    const topCategoryEntry = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    )[0];

    const topCategory = topCategoryEntry
      ? { category: topCategoryEntry[0], amount: topCategoryEntry[1] }
      : null;

    return { totalSpent, transactionCount, averageTransaction, topCategory };
  }, [comparisonMode, compareLineChartTransactions]);

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

  useFocusEffect(
    React.useCallback(() => {
      setTimeRange("week");
      setSelectedWeek(new Date());
      setSelectedMonthYear(new Date());
      setSelectedYear(new Date().getFullYear());
      setCategory("");
    }, [])
  );

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
      <Text variant="headlineLarge">Analytics</Text>
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
        </View>

        {/* <Button mode="elevated" onPress={() => setCategory("")}>
        <Text>Clear Category Filter</Text>
      </Button> */}
        <Button mode="outlined" onPress={resetFilters} compact>
          Reset Filters
        </Button>
      </Card>

      {loading && <Text>Loading...</Text>}
      {error && <Text>{error}</Text>}

      {chartData.some((item) => item.value > 0) ? (
        <View style={{ gap: 20 }}>
          <Card style={{ padding: 16, overflow: "hidden" }}>
            <Card.Title title="Spending Over Time" />
            <Card.Content>
              <View style={{ overflow: "hidden" }}>
                <LineChart
                  data={chartData}
                  data2={comparisonMode ? compareChartData : undefined}
                  width={Dimensions.get("window").width - 72}
                  height={250}
                  spacing={
                    timeRange === "week" ? 40 : timeRange === "month" ? 10 : 30
                  }
                  initialSpacing={10}
                  color="transparent"
                  color2="transparent"
                  yAxisOffset={0}
                  yAxisLabelWidth={35}
                  thickness={3}
                  hideDataPoints={true}
                  disableScroll={true}
                  startFillColor="#4A90E2"
                  endFillColor="#E3F2FD"
                  startFillColor2="#FF6B6B"
                  endFillColor2="#FFE5E5"
                  startOpacity={0.9}
                  endOpacity={0.6}
                  startOpacity2={0.9}
                  endOpacity2={0.6}
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
              </View>
            </Card.Content>
            <CategoryFilter
              selectedCategory={category}
              onCategoryChange={setCategory}
            />
          </Card>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <Card style={{ flex: 1, minWidth: "45%", padding: 12 }}>
              <Text variant="labelMedium" style={{ opacity: 0.7 }}>
                Total Spent
              </Text>
              <Text variant="headlineSmall">
                £{statistics.totalSpent.toFixed(2)}
              </Text>
              {comparisonMode && compareStatistics && (
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
                    ((statistics.totalSpent - compareStatistics.totalSpent) /
                      compareStatistics.totalSpent) *
                      100
                  ).toFixed(1)}
                  % vs prev
                </Text>
              )}
            </Card>

            <Card style={{ flex: 1, minWidth: "45%", padding: 12 }}>
              <Text variant="labelMedium" style={{ opacity: 0.7 }}>
                Transactions
              </Text>
              <Text variant="headlineSmall">{statistics.transactionCount}</Text>
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
                      compareStatistics.transactionCount
                  )}{" "}
                  vs prev
                </Text>
              )}
            </Card>

            <Card style={{ flex: 1, minWidth: "45%", padding: 12 }}>
              <Text variant="labelMedium" style={{ opacity: 0.7 }}>
                Average
              </Text>
              <Text variant="headlineSmall">
                £{statistics.averageTransaction.toFixed(2)}
              </Text>
              {comparisonMode && compareStatistics && (
                <Text
                  variant="bodySmall"
                  style={{
                    color:
                      compareStatistics.averageTransaction >
                      statistics.averageTransaction
                        ? "#4CAF50"
                        : "#F44336",
                  }}
                >
                  {compareStatistics.averageTransaction >
                  statistics.averageTransaction
                    ? "↓"
                    : "↑"}
                  {Math.abs(
                    ((statistics.averageTransaction -
                      compareStatistics.averageTransaction) /
                      compareStatistics.averageTransaction) *
                      100
                  ).toFixed(1)}
                  % vs prev
                </Text>
              )}
            </Card>

            {statistics.topCategory && (
              <Card style={{ flex: 1, minWidth: "45%", padding: 12 }}>
                <Text variant="labelMedium" style={{ opacity: 0.7 }}>
                  Top Category
                </Text>
                <Text variant="titleMedium">
                  {getCategoryDisplayName(statistics.topCategory.category)}
                </Text>
                <Text variant="bodyMedium">
                  £{statistics.topCategory.amount.toFixed(2)}
                </Text>
              </Card>
            )}
          </View>
        </View>
      ) : (
        <Text>No line chart data to display</Text>
      )}

      {categoryData.length > 0 ? (
        <View style={{ gap: 20 }}>
          <Card style={{ padding: 16, overflow: "hidden" }}>
            <Card.Title title="Proportion of Spending by Category" />
            <Card.Content style={{ alignItems: "center" }}>
              <View style={{ overflow: "hidden", alignItems: "center" }}>
                <PieChart
                  data={pieChartData}
                  donut
                  focusOnPress
                  radius={100}
                  innerRadius={50}
                />
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
                      {getCategoryDisplayName(item.text)}:{" "}
                      {item.value.toFixed(2)}%
                    </Text>
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>
          <Card style={{ padding: 16, overflow: "hidden" }}>
            <Card.Title title="Spending by Category" />
            <Card.Content>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ overflow: "hidden" }}>
                  <BarChart
                    data={barChartData}
                    width={Math.max(
                      Dimensions.get("window").width - 72,
                      barChartData.length * 60
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
                </View>
              </ScrollView>
            </Card.Content>
          </Card>
        </View>
      ) : (
        <Text>No category data to display</Text>
      )}
    </ScrollView>
  );
}
