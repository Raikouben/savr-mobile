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
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState("housing");
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
      setCategory("housing");

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
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text>Select Date: {date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <TextInput
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
          />

          <Picker selectedValue={category} onValueChange={setCategory}>
            <Picker.Item label="Housing" value="housing" />
            <Picker.Item label="Utilities" value="utilities" />
            <Picker.Item label="Transportation" value="transportation" />
            <Picker.Item label="Food" value="food" />
            <Picker.Item label="Shopping" value="shopping" />
            <Picker.Item label="Health" value="health" />
            <Picker.Item label="Entertainment" value="entertainment" />
            <Picker.Item label="Miscellaneous" value="miscellaneous" />
          </Picker>
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
