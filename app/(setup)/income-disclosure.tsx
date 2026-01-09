import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { View, TextInput, Text } from "react-native";

export default function IncomeDisclosure() {
  const router = useRouter();
  const [income, setIncome] = useState<number | null>(null);
  const { updateUserIncome } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    setSubmitting(true);
    if (income == null) {
      setSubmitting(false);
      alert("Please enter your income");
      return;
    }
    try {
      await updateUserIncome(income);
    } catch (error) {
      setSubmitting(false);
      console.error("Error updating income:", error);
      alert("There was an error updating your income. Please try again.");
      return;
    }
    setSubmitting(false);
    router.replace("/(setup)/lifestyle-survey");
  };
  return (
    <View>
      <Text>Income disclosure</Text>
      <TextInput
        autoCapitalize="none"
        value={income !== null ? income.toString() : ""}
        placeholder="Enter income"
        onChangeText={(income) => setIncome(Number(income))}
        keyboardType="numeric"
      />
      <Text onPress={handleSubmit} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </Text>
    </View>
  );
}
