import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { useEffect } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import AddTransaction from "../../components/AddTransaction";
import addBulkTransaction from "@/components/addBulkTransaction";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { useMemo } from "react";
import DateSelector from "../../components/DateSelector";
import CategoryPicker from "../../components/CategoryPicker";
import { useTransactionQuery } from "@/hooks/queries/transactionQuery";

export default function transactions() {
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [category, setCategory] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { transactions, isLoading: loading } = useTransactionQuery();
  const [singleTransaction, setSingleTransaction] = useState(true);

  const resetFilters = () => {
    setDate(null);
    setCategory("");
  };

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    let filtered = transactions;

    if (date) {
      const selectedDate = date.toISOString().split("T")[0];
      filtered = filtered.filter((tx: any) => {
        const txDate = new Date(tx.date).toISOString().split("T")[0];
        return txDate === selectedDate;
      });
    }

    if (category) {
      filtered = filtered.filter((tx: any) => tx.category === category);
    }

    return filtered.sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, date, category]);

  return (
    <View>
      {loading && <Text>Loading...</Text>}
      {error && <Text>{error}</Text>}
      {transactions && (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
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
              <Ionicons
                name="add-circle-outline"
                size={32}
                color="black"
                onPress={() => setModalVisible(true)}
              />
            </View>
          }
          renderItem={({ item }) => (
            <View>
              <Text>{item.category}</Text>
              <Text>£{(parseFloat(item.amount) || 0).toFixed(2)}</Text>
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
          }}
        />
      )}
    </View>
  );
}
