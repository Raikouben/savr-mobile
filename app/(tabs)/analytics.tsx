import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import React from "react";
import { useEffect } from "react";
import { LineChart } from "react-native-gifted-charts";
import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useMemo } from "react";
import CategoryPicker from "@/components/CategoryPicker";
import MonthPicker from "react-native-month-year-picker";

export default function analytics() {
  const [transactions, setTransactions] = useState<any[] | null>(null);
  const { getTransactions } = useTransactions();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );
  const [category, setCategory] = useState<string>("");

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

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <View>
      <Text>Analytics</Text>

      {/* Time Range Toggle */}
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
    </View>
  );
}
