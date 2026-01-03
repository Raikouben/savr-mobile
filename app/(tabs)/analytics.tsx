import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import React from "react";
import { useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { LineChart } from "react-native-gifted-charts";
import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useMemo } from "react";
import CategoryPicker from "@/components/CategoryPicker";
import { aggregateByTimeRange, formatChartLabel } from "@/utils/calculation";

export default function analytics() {
  const [transactions, setTransactions] = useState<any[] | null>(null);
  const { getTransactions } = useTransactions();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [category, setCategory] = useState<string>("");
  const [selectedMonthYear, setSelectedMonthYear] = useState<Date>(new Date());
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const transactionsData = await getTransactions();
      setTransactions(transactionsData);
    } catch (error) {
      setError("Failed to fetch transactions");
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    if (category) {
      return transactions.filter((tx) => tx.category === category);
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

  useEffect(() => {
    fetchTransactions();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setTimeRange("week");
      setSelectedWeek(new Date());
      setSelectedMonthYear(new Date());
      setSelectedYear(new Date().getFullYear());
      setCategory("");
      fetchTransactions();
    }, [])
  );

  return (
    <View>
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

      {category && (
        <TouchableOpacity onPress={() => setCategory("")}>
          <Text>Clear Category Filter</Text>
        </TouchableOpacity>
      )}

      {loading && <Text>Loading...</Text>}
      {error && <Text>{error}</Text>}

      {chartData.length > 0 ? (
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
            startOpacity={0.4}
            endOpacity={0.1}
            areaChart
            curved
            yAxisColor="#ddd"
            xAxisColor="transparent"
            yAxisTextStyle={{ color: "#666" }}
            xAxisLabelTextStyle={{ color: "#666", fontSize: 10 }}
            rulesColor="transparent"
            rulesType="solid"
            yAxisThickness={0}
            xAxisThickness={0}
          />
        </View>
      ) : (
        <Text>No data to display</Text>
      )}
    </View>
  );
}
