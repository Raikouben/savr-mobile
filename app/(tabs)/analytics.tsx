import {
  View,
  Text,
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
      label: item.category,
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
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <Text>Analytics</Text>

      <View>
        <TouchableOpacity onPress={() => setTimeRange("week")}>
          <Text>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTimeRange("month")}>
          <Text>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTimeRange("year")}>
          <Text>Year</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={navigatePrevious}>
          <Text>{"<"}</Text>
        </TouchableOpacity>

        <Text>{getTimeRangeLabel()}</Text>

        <TouchableOpacity onPress={navigateNext} disabled={!canNavigateNext()}>
          <Text>{">"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setComparisonMode(!comparisonMode)}>
        <Text>
          {comparisonMode ? "Comparison Mode: ON" : "Enable Comparison"}
        </Text>
      </TouchableOpacity>

      {comparisonMode && (
        <View>
          <Text>Compare With:</Text>
          <View>
            <TouchableOpacity onPress={navigateComparePrevious}>
              <Text>{"<"}</Text>
            </TouchableOpacity>

            <Text>{getTimeRangeLabel(true)}</Text>

            <TouchableOpacity onPress={navigateCompareNext}>
              <Text>{">"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <CategoryPicker
        selectedCategory={category}
        onCategoryChange={setCategory}
      />

      <TouchableOpacity onPress={() => setCategory("")}>
        <Text>Clear Category Filter</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={resetFilters}>
        <Text>Reset Filters</Text>
      </TouchableOpacity>

      <View>
        <Text>Statistics</Text>
        {comparisonMode && compareStatistics ? (
          <View>
            <View>
              <Text>{getTimeRangeLabel()}</Text>
              <View>
                <View>
                  <Text>Total Spent</Text>
                  <Text>£{statistics.totalSpent.toFixed(2)}</Text>
                </View>
                <View>
                  <Text>Transactions</Text>
                  <Text>{statistics.transactionCount}</Text>
                </View>
                <View>
                  <Text>Average</Text>
                  <Text>£{statistics.averageTransaction.toFixed(2)}</Text>
                </View>
                {statistics.topCategory && (
                  <View>
                    <Text>Top Category</Text>
                    <Text>
                      {getCategoryDisplayName(statistics.topCategory.category)}
                    </Text>
                    <Text>£{statistics.topCategory.amount.toFixed(2)}</Text>
                  </View>
                )}
              </View>
            </View>

            <View>
              <Text>{getTimeRangeLabel(true)}</Text>
              <View>
                <View>
                  <Text>Total Spent</Text>
                  <Text>£{compareStatistics.totalSpent.toFixed(2)}</Text>
                  <Text>
                    {compareStatistics.totalSpent > statistics.totalSpent
                      ? "up"
                      : "down"}
                    {Math.abs(
                      ((statistics.totalSpent - compareStatistics.totalSpent) /
                        compareStatistics.totalSpent) *
                        100
                    ).toFixed(1)}
                    %
                  </Text>
                </View>
                <View>
                  <Text>Transactions</Text>
                  <Text>{compareStatistics.transactionCount}</Text>
                  <Text>
                    {compareStatistics.transactionCount >
                    statistics.transactionCount
                      ? "↑"
                      : "↓"}
                    {Math.abs(
                      statistics.transactionCount -
                        compareStatistics.transactionCount
                    )}
                  </Text>
                </View>
                <View>
                  <Text>Average</Text>
                  <Text>
                    £{compareStatistics.averageTransaction.toFixed(2)}
                  </Text>
                  <Text>
                    {compareStatistics.averageTransaction >
                    statistics.averageTransaction
                      ? "up"
                      : "down"}
                    {Math.abs(
                      ((statistics.averageTransaction -
                        compareStatistics.averageTransaction) /
                        compareStatistics.averageTransaction) *
                        100
                    ).toFixed(1)}
                    %
                  </Text>
                </View>
                {compareStatistics.topCategory && (
                  <View>
                    <Text>Top Category</Text>
                    <Text>
                      {getCategoryDisplayName(
                        compareStatistics.topCategory.category
                      )}
                    </Text>
                    <Text>
                      £{compareStatistics.topCategory.amount.toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ) : (
          <View>
            <View>
              <Text>Total Spent</Text>
              <Text>£{statistics.totalSpent.toFixed(2)}</Text>
            </View>
            <View>
              <Text>Transactions</Text>
              <Text>{statistics.transactionCount}</Text>
            </View>
            <View>
              <Text>Average</Text>
              <Text>£{statistics.averageTransaction.toFixed(2)}</Text>
            </View>
            {statistics.topCategory && (
              <View>
                <Text>Top Category</Text>
                <Text>
                  {getCategoryDisplayName(statistics.topCategory.category)}
                </Text>
                <Text>£{statistics.topCategory.amount.toFixed(2)}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {loading && <Text>Loading...</Text>}
      {error && <Text>{error}</Text>}

      {chartData.some((item) => item.value > 0) ? (
        <View>
          <LineChart
            data={chartData}
            data2={comparisonMode ? compareChartData : undefined}
            width={Dimensions.get("window").width - 60}
            height={250}
            spacing={
              timeRange === "week" ? 55 : timeRange === "month" ? 10 : 30
            }
            initialSpacing={20}
            color="transparent"
            color2="transparent"
            yAxisOffset={0}
            yAxisLabelWidth={50}
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
            yAxisTextStyle={{ color: "#666" }}
            xAxisLabelTextStyle={{ color: "#666", fontSize: 10 }}
            // rulesColor="transparent"
            rulesLength={Dimensions.get("window").width - 60 - 16}
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
      ) : (
        <Text>No line chart data to display</Text>
      )}

      {categoryData.length > 0 ? (
        <View>
          <View>
            <PieChart
              data={pieChartData}
              donut
              focusOnPress
              radius={100}
              innerRadius={50}
            />
            <View>
              {pieChartData.map((item, index) => (
                <View key={index}>
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      backgroundColor: item.color,
                      marginRight: 8,
                      borderRadius: 4,
                    }}
                  />
                  <Text>
                    {getCategoryDisplayName(item.text)}: {item.value.toFixed(2)}
                    %
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View>
            <BarChart
              data={barChartData}
              width={Dimensions.get("window").width - 60}
              height={250}
              barWidth={30}
              spacing={20}
              yAxisThickness={0}
              xAxisThickness={0}
              yAxisLabelWidth={50}
              yAxisTextStyle={{ color: "#666" }}
              xAxisLabelTextStyle={{ color: "#666", fontSize: 10 }}
              yAxisColor="transparent"
              xAxisColor="transparent"
              maxValue={barChartYAxisSettings.maxValue}
              stepValue={barChartYAxisSettings.stepValue}
            />
          </View>
        </View>
      ) : (
        <Text>No category data to display</Text>
      )}
    </ScrollView>
  );
}
