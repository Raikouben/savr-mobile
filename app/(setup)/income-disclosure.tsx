import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { View } from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { useAppTheme } from "@/themes/useAppTheme";
export default function IncomeDisclosure() {
  const router = useRouter();
  const [income, setIncome] = useState<number | null>(null);
  const { user, updateUserIncome, isLoading } = useUserQuery();
  const [submitting, setSubmitting] = useState(false);
  const { edit } = useLocalSearchParams();
  const { backgroundColor } = useAppTheme();

  useEffect(() => {
    if (user?.income != null && income === null) {
      setIncome(user.income);
    }
  }, [user?.income]);

  useEffect(() => {
    if (edit) {
      return;
    } else if (!isLoading && user?.income != null) {
      console.log("Income already set, redirecting to lifestyle survey");
      router.replace("/(setup)/lifestyle-survey");
    }
  }, [isLoading, edit]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  console.log("User data:", JSON.stringify(user));
  console.log("User income:", user?.income);

  console.log("No income set, displaying income disclosure form");
  const handleSubmit = async () => {
    setSubmitting(true);
    if (income == null || income <= 0) {
      setSubmitting(false);
      alert("Please enter a valid income greater than 0");
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        gap: 20,
        backgroundColor: backgroundColor,
        flexGrow: 1,
      }}
    >
      <Card style={{ width: "100%", maxWidth: 400 }}>
        <Card.Title title="Income disclosure" />
        <TextInput
          mode="outlined"
          label="Monthly Income (£)"
          autoCapitalize="none"
          value={income !== null ? income.toString() : ""}
          placeholder="Enter income"
          onChangeText={(text) => {
            const numValue = Number(text);
            if (!isNaN(numValue)) {
              setIncome(numValue);
            }
          }}
          keyboardType="numeric"
          style={{ margin: 16 }}
        />
        <Card.Actions>
          <Button mode="contained" onPress={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
