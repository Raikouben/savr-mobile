import { View, FlatList, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useEffect } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import AddTransaction from "../../components/AddTransaction";
import AddBulkTransaction from "@/components/addBulkTransaction";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { useMemo } from "react";
import DateSelector from "../../components/DateSelector";
import CategoryPicker from "../../components/CategoryPicker";
import { useTransactionQuery } from "@/hooks/queries/transactionQuery";
import { getCategoryDisplayName, getCategoryIcon } from "@/constants/config";
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
  AnimatedFAB,
  FAB,
} from "react-native-paper";
export default function transactions() {
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [category, setCategory] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [bulkModalVisible, setBulkModalVisible] = useState<boolean>(false);
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
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [transactions, date, category]);

  return (
    <View style={{ padding: 20, gap: 20, backgroundColor: "#8a77aa" }}>
      {loading && (
        <ActivityIndicator animating={true} color={MD2Colors.purple500} />
      )}
      {error && <Text>{error}</Text>}
      {transactions && (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <View>
              <Text variant="headlineLarge">Transactions</Text>
              <DateSelector date={date} onDateChange={setDate} />
              <CategoryPicker
                selectedCategory={category}
                onCategoryChange={setCategory}
              />
              <Button mode="outlined" onPress={resetFilters}>
                <Text>Reset Filters</Text>
              </Button>
              <Button mode="outlined" onPress={() => setBulkModalVisible(true)}>
                <Text>Test Bulk Transaction</Text>
              </Button>
            </View>
          }
          renderItem={({ item }) => (
            <List.Item
              title={getCategoryDisplayName(item.category)}
              description={`${new Date(item.date).toLocaleDateString()}${
                item.description ? ` • ${item.description}` : ""
              }`}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={getCategoryIcon(item.category) as any}
                />
              )}
              right={() => (
                <Text variant="titleMedium">
                  £{(parseFloat(item.amount) || 0).toFixed(2)}
                </Text>
              )}
            />
          )}
        />
      )}
      <FAB
        icon="plus"
        style={{ position: "absolute", right: 16, bottom: 16 }}
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
      {bulkModalVisible && (
        <AddBulkTransaction
          visible={bulkModalVisible}
          onClose={() => setBulkModalVisible(false)}
          onSuccess={() => {
            setBulkModalVisible(false);
          }}
        />
      )}
    </View>
  );
}
