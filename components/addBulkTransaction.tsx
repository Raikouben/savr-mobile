import {
  Modal,
  Text,
  Button,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";
import DateSelector from "./DateSelector";
import CategoryPicker from "./CategoryPicker";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTransactionQuery } from "@/hooks/queries/transactionQuery";
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
  const [draftTransactions, setDraftTransactions] = useState<transaction[]>([]);

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
      <View>
        <View>
          <Text>Add Multiple Transactions</Text>

          {/* Scrollable list of transaction cards */}
          <View style={{ flex: 1, marginBottom: 15 }}>
            {draftTransactions.map((tx, index) => (
              <View key={index}>
                <View>
                  <Text>Transaction {index + 1}</Text>
                  <TouchableOpacity
                    onPress={() => removeDraftTransaction(index)}
                  >
                    <Text>delete</Text>
                  </TouchableOpacity>
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
          </View>

          <View>
            <TouchableOpacity onPress={onClose}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} disabled={isCreatingBulk}>
              <Text style={{ fontSize: 16, color: "white" }}>
                {isCreatingBulk ? "Saving" : "Save All Transactions"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
