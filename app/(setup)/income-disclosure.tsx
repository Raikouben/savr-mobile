import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { View, TextInput, Text } from "react-native";

export default function IncomeDisclosure() {
  const router = useRouter();
  const [income, setIncome] = useState<number | null>(null);
  const { user, updateUserIncome, isLoading } = useUserQuery();
  const [submitting, setSubmitting] = useState(false);
  const { edit } = useLocalSearchParams();

  useEffect(() => {
    if (edit) {
      return;
    } else if (!isLoading && user?.income != null) {
      console.log("Income already set, redirecting to lifestyle survey");
      router.replace("/(setup)/lifestyle-survey");
    }
  }, [isLoading, user?.income, router]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  console.log("User data:", JSON.stringify(user));
  console.log("User income:", user?.income);

  console.log("No income set, displaying income disclosure form");
  const handleSubmit = async () => {
    setSubmitting(true);
    if (income == null) {
      setSubmitting(false);
      alert("Please enter your income");
      return;
    }
    try {
      console.log("Submitting income:", income);
      const result = await updateUserIncome(income);
      console.log("Update result:", result);
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
