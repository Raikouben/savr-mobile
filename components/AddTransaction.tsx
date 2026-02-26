import { View, TouchableOpacity, Platform } from "react-native";
import React, { useState } from "react";
import DateSelector from "./DateSelector";
import CategoryPicker from "./CategoryPicker";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTransactionQuery } from "@/hooks/queries/transactionQuery";
import MerchantSearch from "./MerchantSearch";
import { merchantCategoryMap } from "@/constants/config";
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
  Dialog,
  IconButton,
} from "react-native-paper";
import { useAppTheme } from "@/themes/useAppTheme";
export default function AddTransaction({
  visible,
  onClose,
  onSuccess,
  onSwitchToBulk,
  onSwitchToSubscription,
}: {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToBulk?: () => void;
  onSwitchToSubscription?: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const { createTransaction, isCreating } = useTransactionQuery();
  const { backgroundColor, textOnPrimary } = useAppTheme();
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
    <Portal>
      <Dialog visible={visible} onDismiss={onClose}>
        <View
          style={{
            paddingHorizontal: 24,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              flex: 1,
            }}
          >
            Add Transactions
          </Text>
          <IconButton icon="sync" size={20} onPress={onSwitchToSubscription} />
          <IconButton
            icon="format-list-bulleted"
            size={20}
            onPress={onSwitchToBulk}
          />
        </View>
        <Dialog.Content>
          <DateSelector date={date} onDateChange={setDate} mode="input" />
          <MerchantSearch
            onSelect={(merchant) => {
              if (!description) setDescription(merchant.name);
              setCategory(
                merchantCategoryMap[
                  merchant.category as keyof typeof merchantCategoryMap
                ],
              );
            }}
          />

          <TextInput
            mode="outlined"
            label="Amount"
            placeholder="Amount"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />

          <TextInput
            mode="outlined"
            label="Description"
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
          />
          <CategoryPicker
            selectedCategory={category}
            onCategoryChange={setCategory}
          />
        </Dialog.Content>
        <Dialog.Actions style={{ marginTop: 10 }}>
          <Button onPress={handleSubmit} mode="contained" disabled={submitting}>
            <Text style={{ color: textOnPrimary, fontWeight: "bold" }}>
              Add Transaction
            </Text>
          </Button>
          <Button mode="contained-tonal" onPress={onClose}>
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
