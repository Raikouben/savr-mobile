import { View, ScrollView } from "react-native";
import React, { useState } from "react";
import DateSelector from "./DateSelector";
import CategoryPicker from "./CategoryPicker";
import { useSubscriptionQuery } from "@/hooks/queries/subscriptionQuery";
import MerchantSearch from "./MerchantSearch";
import { merchantCategoryMap } from "@/constants/config";
import {
  Text,
  TextInput,
  Button,
  Portal,
  Dialog,
  SegmentedButtons,
} from "react-native-paper";
import { useAppTheme } from "@/themes/useAppTheme";

export default function AddSubscription({
  visible,
  onClose,
  onSuccess,
  onSwitchToTransaction,
  onSwitchToBulk,
}: {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToTransaction?: () => void;
  onSwitchToBulk?: () => void;
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [nextBillingDate, setNextBillingDate] = useState<Date | null>(
    new Date(),
  );
  const [submitting, setSubmitting] = useState(false);

  const { createSubscription } = useSubscriptionQuery();
  const { textOnPrimary } = useAppTheme();

  const handleSubmit = async () => {
    if (!nextBillingDate) {
      alert("Please select a billing date");
      return;
    }
    if (!category) {
      alert("Please select a category");
      return;
    }
    if (!name.trim()) {
      alert("Please enter a subscription name");
      return;
    }

    setSubmitting(true);
    try {
      await createSubscription({
        name: name.trim(),
        amount: parseFloat(amount),
        category,
        billing_cycle: billingCycle,
        next_billing_date: nextBillingDate.toISOString().split("T")[0],
      });

      // Clear form
      setName("");
      setAmount("");
      setCategory("");
      setBillingCycle("monthly");
      setNextBillingDate(new Date());

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating subscription:", error);
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
          }}
        >
          <Dialog.Title>Add Subscription</Dialog.Title>
          <View style={{ flexDirection: "row" }}>
            <Button mode="text" compact onPress={onSwitchToTransaction}>
              Transaction
            </Button>
            <Button mode="text" compact onPress={onSwitchToBulk}>
              Bulk
            </Button>
          </View>
        </View>
        <Dialog.Content>
          <ScrollView showsVerticalScrollIndicator={false}>
            <MerchantSearch
              onSelect={(merchant) => {
                if (!name) setName(merchant.name);
                setCategory(
                  merchantCategoryMap[
                    merchant.category as keyof typeof merchantCategoryMap
                  ],
                );
              }}
            />
            <TextInput
              mode="outlined"
              label="Subscription Name"
              placeholder="e.g., Netflix, Spotify"
              value={name}
              onChangeText={setName}
              // style={{ marginBottom: 8 }}
            />

            <TextInput
              mode="outlined"
              label="Amount"
              placeholder="Amount"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              style={{ marginBottom: 8 }}
            />

            <CategoryPicker
              selectedCategory={category}
              onCategoryChange={setCategory}
            />

            <View style={{ marginVertical: 8, marginTop: 16 }}>
              <Text variant="labelMedium" style={{ marginBottom: 8 }}>
                Billing Cycle
              </Text>
              <SegmentedButtons
                value={billingCycle}
                onValueChange={setBillingCycle}
                buttons={[
                  { value: "monthly", label: "Monthly" },
                  { value: "yearly", label: "Yearly" },
                ]}
              />
            </View>

            <DateSelector
              date={nextBillingDate}
              onDateChange={setNextBillingDate}
              mode="input"
              label="Next Billing Date"
            />
          </ScrollView>

          <Dialog.Actions style={{ marginTop: 10 }}>
            <Button
              onPress={handleSubmit}
              mode="contained"
              disabled={submitting}
            >
              <Text style={{ color: textOnPrimary, fontWeight: "bold" }}>
                Add Subscription
              </Text>
            </Button>
            <Button mode="contained-tonal" onPress={onClose}>
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}
