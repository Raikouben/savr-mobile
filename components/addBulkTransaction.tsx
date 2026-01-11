import {
  Modal,
  Text,
  Button,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import DateSelector from "./DateSelector";
import CategoryPicker from "./CategoryPicker";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTransactionQuery } from "@/hooks/queries/transactionQuery";
// import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";
type transaction = {
  amount: number;
  category: string;
  date: Date;
  description?: string;
};

export default function addBulkTransaction({
  visible,
  onClose,
  onSuccess,
}: {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  //   const [amount, setAmount] = useState("");
  //   const [description, setDescription] = useState("");
  //   const [date, setDate] = useState<Date | null>(new Date());
  //   const [category, setCategory] = useState("");
  const { createBulkTransactions, isCreatingBulk, isLoading, isCreating } =
    useTransactionQuery();
  const [draftTransactions, setDraftTransactions] = useState<transaction[]>([
    {
      amount: 0,
      category: "",
      date: new Date(),
      description: "",
    },
  ]);

  const addDraftTransaction = (tx: transaction) => {
    setDraftTransactions([...draftTransactions, tx]);
  };

  const removeDraftTransaction = (index: number) => {
    const updatedDrafts = [...draftTransactions];
    updatedDrafts.splice(index, 1);
    setDraftTransactions(updatedDrafts);
  };

  const updateDraftTransaction = (index: number, updatedTx: transaction) => {
    const updatedDrafts = [...draftTransactions];
    updatedDrafts[index] = updatedTx;
    setDraftTransactions(updatedDrafts);
  };

  const handleSubmit = async () => {
    if (draftTransactions.length === 0) {
      alert("Please add at least one transaction");
      return;
    }

    try {
      await createBulkTransactions(
        draftTransactions.map((tx) => ({
          amount: tx.amount,
          category: tx.category,
          date: tx.date.toISOString().split("T")[0],
          description: tx.description,
        }))
      );
      setDraftTransactions([]);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating transactions:", error);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            width: "90%",
            maxWidth: 500,
            height: "55%",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
            Add Multiple Transactions
          </Text>

          {/* Scrollable list of transaction cards */}
          <ScrollView
            style={{ flex: 1, marginBottom: 15 }}
            showsVerticalScrollIndicator={true}
          >
            {draftTransactions.map((tx, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <View>
                  <Text>Transaction {index + 1}</Text>
                  <TouchableOpacity
                    onPress={() => removeDraftTransaction(index)}
                  >
                    <Text>delete</Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <View>
                    <Text>Date</Text>
                    <DateSelector
                      date={tx.date}
                      onDateChange={(newDate) =>
                        updateDraftTransaction(index, {
                          ...tx,
                          date: newDate || new Date(),
                        })
                      }
                    />
                  </View>
                  <View>
                    <Text>Category</Text>
                    <CategoryPicker
                      selectedCategory={tx.category}
                      onCategoryChange={(newCategory) =>
                        updateDraftTransaction(index, {
                          ...tx,
                          category: newCategory,
                        })
                      }
                    />
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text>Description</Text>
                    <TextInput
                      placeholder="Description"
                      value={tx.description || ""}
                      onChangeText={(text) =>
                        updateDraftTransaction(index, {
                          ...tx,
                          description: text,
                        })
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>Amount</Text>
                    <TextInput
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                      value={tx.amount.toString()}
                      onChangeText={(text) =>
                        updateDraftTransaction(index, {
                          ...tx,
                          amount: parseFloat(text) || 0,
                        })
                      }
                    />
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={() =>
                addDraftTransaction({
                  amount: 0,
                  category: "",
                  date: new Date(),
                  description: "",
                })
              }
            >
              <Text>+ Add Another Transaction</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#e0e0e0",
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 14 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isCreatingBulk}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#1a1a1a",
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 14, color: "white" }}>
                {isCreatingBulk ? "Saving" : "Save All"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
