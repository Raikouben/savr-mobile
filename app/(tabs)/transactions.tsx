import { View, Text, FlatList } from "react-native";
import React from "react";
import { useEffect } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import AddTransaction from "../../components/AddTransaction";
import { Ionicons } from "@expo/vector-icons";

export default function transactions() {
  const [transactions, setTransactions] = React.useState<any[] | null>(null);
  const { getTransactions } = useTransactions();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [date, setDate] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

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

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <View>
      <Text>Transactions</Text>
      {loading && <Text>Loading...</Text>}
      {error && <Text>{error}</Text>}
      {transactions && (
        <FlatList
          data={transactions}
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
