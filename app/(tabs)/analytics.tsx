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

export default function analytics() {
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [category, setCategory] = useState<string>("");
  const [selectedMonthYear, setSelectedMonthYear] = useState<Date>(new Date());
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  // const [pieData, setPieData] = useState<any[]>([]);
  const { budget, isLoading: budgetLoading } = useBudgetQuery();
  const { transactions, isLoading: transactionsLoading } =
    useTransactionQuery();

  const resetFilters = () => {
    setTimeRange("week");
    setSelectedWeek(new Date());
    setSelectedMonthYear(new Date());
    setSelectedYear(new Date().getFullYear());
    setCategory("");
  };

  const loading = budgetLoading || transactionsLoading;

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    if (category) {
      return transactions.filter((tx: any) => tx.category === category);
    }
    return transactions;
  }, [transactions, category]);

  const chartData = useMemo(() => {
    const data = aggregateByTimeRange(
      filteredTransactions,
      timeRange,
      timeRange === "month" ? selectedMonthYear : undefined,
      timeRange === "year" ? selectedYear : undefined,
      timeRange === "week" ? selectedWeek : undefined
    );
    console.log("Final chart data:", data);
    return data;
  }, [
    filteredTransactions,
    timeRange,
    selectedMonthYear,
    selectedYear,
    selectedWeek,
  ]);

  const categoryData = useMemo(() => {
    return categoriseSpending(filteredTransactions);
  }, [filteredTransactions]);

  const colors = [
    "#FF6B6B",
    "#4A90E2",
    "#2ECC71",
    "#F39C12",
    "#9B59B6",
    "#E67E22",
  ];

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

  const yAxisSettings = useMemo(() => {
    const maxValue =
      chartData.length > 0
        ? Math.max(...chartData.map((item) => item.value))
        : 0;
    return yAxisConfig(maxValue);
  }, [chartData]);

  const getTimeRangeLabel = () => {
    if (timeRange === "week") {
      const weekDate = new Date(selectedWeek);
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
      return selectedMonthYear.toLocaleDateString("en-UK", {
        month: "long",
        year: "numeric",
      });
    } else {
      return String(selectedYear);
    }
  };

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

      {loading && <Text>Loading...</Text>}
      {error && <Text>{error}</Text>}

      {chartData.some((item) => item.value > 0) ? (
        <View>
          <View>
            <LineChart
              data={chartData}
              width={Dimensions.get("window").width - 60}
              height={250}
              spacing={
                timeRange === "week" ? 55 : timeRange === "month" ? 10 : 30
              }
              initialSpacing={20}
              color="transparent"
              yAxisOffset={0}
              yAxisLabelWidth={50}
              thickness={3}
              hideDataPoints={true}
              disableScroll={true}
              startFillColor="#4A90E2"
              endFillColor="#E3F2FD"
              startOpacity={0.9}
              endOpacity={0.4}
              areaChart
              yAxisColor="#ddd"
              xAxisColor="transparent"
              yAxisTextStyle={{ color: "#666" }}
              xAxisLabelTextStyle={{ color: "#666", fontSize: 10 }}
              rulesColor="transparent"
              rulesType="solid"
              yAxisThickness={0}
              xAxisThickness={0}
              animateOnDataChange={true}
              animationDuration={1000}
              onDataChangeAnimationDuration={300}
              maxValue={yAxisSettings.maxValue}
              stepValue={yAxisSettings.stepValue}
              noOfSections={6}
            />
          </View>
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
                    {item.text}: {item.value.toFixed(2)}%
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
              maxValue={yAxisSettings.maxValue}
              stepValue={yAxisSettings.stepValue}
            />
          </View>
        </View>
      ) : (
        <Text>No data to display</Text>
      )}
    </ScrollView>
  );
}
