import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { useEffect } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import AddTransaction from "../../components/AddTransaction";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { useMemo } from "react";
import DateSelector from "../../components/DateSelector";
import CategoryPicker from "../../components/CategoryPicker";

export default function transactions() {
  const [transactions, setTransactions] = useState<any[] | null>(null);
  const { getTransactions } = useTransactions();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [category, setCategory] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

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

  const resetFilters = () => {
    setDate(null);
    setCategory("");
  };

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    let filtered = transactions;

    if (date) {
      const selectedDate = date.toISOString().split("T")[0];
      filtered = filtered.filter((tx) => {
        const txDate = new Date(tx.date).toISOString().split("T")[0];
        return txDate === selectedDate;
      });
    }

    if (category) {
      filtered = filtered.filter((tx) => tx.category === category);
    }

    return filtered;
  }, [transactions, date, category]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <View>
      <Text>Transactions</Text>
      <DateSelector date={date} onDateChange={setDate} />
      <CategoryPicker
        selectedCategory={category}
        onCategoryChange={setCategory}
      />
      <TouchableOpacity onPress={resetFilters}>
        <Text>Reset Filters</Text>
      </TouchableOpacity>
      {loading && <Text>Loading...</Text>}
      {error && <Text>{error}</Text>}
      {transactions && (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>{item.category}</Text>
              <Text>${(parseFloat(item.amount) || 0).toFixed(2)}</Text>
              <Text>{new Date(item.date).toLocaleDateString()}</Text>
              {item.description && <Text>{item.description}</Text>}
            </View>
          )}
        />
      )}
      <Ionicons
        name="add-circle-outline"
        size={32}
        color="black"
        onPress={() => setModalVisible(true)}
      />
      {modalVisible && (
        <AddTransaction
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSuccess={() => {
            setModalVisible(false);
            fetchTransactions();
          }}
        />
      )}
    </View>
  );
}
