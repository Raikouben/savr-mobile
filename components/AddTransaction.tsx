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
import { useTransactions } from "@/hooks/useTransactions";
export default function AddTransaction({
  visible,
  onClose,
  onSuccess,
}: {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const { createTransaction } = useTransactions();
  const [submitting, setSubmitting] = useState(false);

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }
    if (!category) {
      alert("Please select a category");
      return;
    }

    setSubmitting(true);
    try {
      await createTransaction({
        amount: parseFloat(amount),
        category,
        date: date.toISOString().split("T")[0],
        description,
      });
      // Clear form
      setAmount("");
      setDescription("");
      setDate(new Date());
      setCategory("");

      onSuccess?.(); // Tell parent to refresh
      onClose();
    } catch (error) {
      console.error("Error creating transaction:", error);
    } finally {
      setSubmitting(false);
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
            width: "80%",
            maxWidth: 400,
          }}
        >
          <Text>Add Transaction</Text>
          <TextInput
            placeholder="Amount"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          <DateSelector
            date={date}
            onDateChange={setDate}
            defaultToToday={true}
          />
          <TextInput
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
          />
          <CategoryPicker
            selectedCategory={category}
            onCategoryChange={setCategory}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity onPress={handleSubmit}>
              <Text>Add Transaction</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
