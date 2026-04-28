import { View, TouchableOpacity, Platform, ScrollView } from "react-native";
import React, { useState } from "react";
import DateSelector from "./DateSelector";
import CategoryPicker from "./CategoryPicker";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTransactionQuery } from "@/hooks/queries/transactionQuery";
import MerchantSearch from "./MerchantSearch";

import { KeyboardAvoidingView } from "react-native";
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
  onSwitchToSingle,
  onSwitchToSubscription,
}: {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToSingle?: () => void;
  onSwitchToSubscription?: () => void;
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
        })),
      );
      setDraftTransactions([]);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating transactions:", error);
    }
  };
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onClose}
        style={{ maxHeight: "70%" }}
      >
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
            Add Bulk Transactions
          </Text>
          <IconButton icon="sync" size={20} onPress={onSwitchToSubscription} />
          <IconButton icon="plus" size={20} onPress={onSwitchToSingle} />
        </View>
        <Dialog.ScrollArea style={{ paddingHorizontal: 15 }}>
          <ScrollView>
            {draftTransactions.map((tx, index) => (
              <Card key={index} style={{ margin: 12 }}>
                <Card.Title
                  title={`Transaction ${index + 1}`}
                  titleVariant="titleMedium"
                  right={(props) => (
                    <IconButton
                      {...props}
                      icon="delete"
                      size={20}
                      onPress={() => removeDraftTransaction(index)}
                    />
                  )}
                />
                <Card.Content>
                  <View style={{ marginBottom: 12 }}>
                    <View>
                      <DateSelector
                        mode="input"
                        date={tx.date}
                        onDateChange={(newDate) =>
                          updateDraftTransaction(index, {
                            ...tx,
                            date: newDate || new Date(),
                          })
                        }
                      />
                    </View>

                    <View style={{ marginBottom: 8 }}>
                      <MerchantSearch
                        onSelect={(merchant) => {
                          updateDraftTransaction(index, {
                            ...tx,
                            description: tx.description || merchant.name,
                            category: merchant.category,
                          });
                        }}
                      />
                    </View>

                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <View style={{ flex: 1 }}>
                        <TextInput
                          mode="outlined"
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
                        <TextInput
                          mode="outlined"
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
                    <View style={{ marginBottom: 12 }}>
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
                </Card.Content>
              </Card>
            ))}

            <Button
              mode="contained"
              icon="plus"
              onPress={() =>
                addDraftTransaction({
                  amount: 0,
                  category: "",
                  date: new Date(),
                  description: "",
                })
              }
            >
              Add Another Transaction
            </Button>
          </ScrollView>
        </Dialog.ScrollArea>

        <Dialog.Actions>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={isCreatingBulk}
            loading={isCreatingBulk}
          >
            {isCreatingBulk ? "Saving" : "Save All"}
          </Button>
          <Button mode="contained-tonal" onPress={onClose}>
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
