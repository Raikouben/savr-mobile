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
import CategoryFilter from "@/components/CategoryFilter";
import { useAppTheme } from "@/themes/useAppTheme";
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
  IconButton,
  Divider,
  Surface,
} from "react-native-paper";
export default function transactions() {
  const { backgroundColor, textColor, textOnPrimary, surfaceColor } =
    useAppTheme();
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [category, setCategory] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [bulkModalVisible, setBulkModalVisible] = useState<boolean>(false);
  const {
    transactions,
    isLoading: loading,
    deleteTransaction,
    isDeleting,
  } = useTransactionQuery();

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
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [transactions, date, category]);

  return (
    <View style={{ flex: 1, backgroundColor: backgroundColor }}>
      {loading && (
        <ActivityIndicator animating={true} color={MD2Colors.purple500} />
      )}
      {error && <Text>{error}</Text>}
      {transactions && (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ padding: 20 }}
          data={filteredTransactions}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <View>
              <Text variant="headlineLarge" style={{ marginBottom: 20 }}>
                Transactions
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <DateSelector date={date} onDateChange={setDate} />
                <CategoryFilter
                  selectedCategory={category}
                  onCategoryChange={setCategory}
                />
                <Button
                  mode="contained"
                  style={{ paddingHorizontal: 20, alignSelf: "center" }}
                  onPress={resetFilters}
                >
                  <Text
                    style={{
                      color: textOnPrimary,

                      fontWeight: "bold",
                    }}
                  >
                    Reset
                  </Text>
                </Button>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ paddingBottom: 25 }}>
              <List.Item
                style={{
                  backgroundColor: surfaceColor,
                  borderRadius: 8,
                  paddingBottom: 15,
                }}
                title={getCategoryDisplayName(item.category)}
                description={`${new Date(item.date).toLocaleDateString()}${
                  item.description ? ` • ${item.description}` : ""
                }`}
                left={(props) => (
                  <Ionicons
                    name={getCategoryIcon(item.category) as any}
                    size={22}
                    color={textColor}
                    style={{ marginLeft: 8, alignSelf: "center" }}
                  />
                )}
                right={() => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      marginRight: -30,
                    }}
                  >
                    <Text variant="titleMedium" style={{ color: textColor }}>
                      £{(parseFloat(item.amount) || 0).toFixed(2)}
                    </Text>
                    <IconButton
                      icon="delete"
                      size={20}
                      iconColor={textColor}
                      onPress={() => deleteTransaction(item.id)}
                    />
                  </View>
                )}
              />
            </View>
          )}
        />
      )}
      <FAB
        icon="plus"
        style={{ position: "absolute", right: 15, bottom: 50 }}
        onPress={() => setModalVisible(true)}
      />
      {modalVisible && (
        <AddTransaction
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSuccess={() => {
            setModalVisible(false);
          }}
          onSwitchToBulk={() => {
            setModalVisible(false);
            setBulkModalVisible(true);
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
          onSwitchToSingle={() => {
            setBulkModalVisible(false);
            setModalVisible(true);
          }}
        />
      )}
    </View>
  );
}
