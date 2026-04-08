import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter, Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { View } from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { useAppTheme } from "@/themes/useAppTheme";
import { ActivityIndicator } from "react-native-paper";

export default function IncomeDisclosure() {
  const router = useRouter();
  const [income, setIncome] = useState<number | null>(null);
  const { user, updateUserIncome, isLoading: userLoading } = useUserQuery();
  const { budget, isLoading: budgetLoading } = useBudgetQuery();
  const [submitting, setSubmitting] = useState(false);
  const { edit } = useLocalSearchParams();
  const { backgroundColor, textColor } = useAppTheme();

  // If setup is already complete (user has budget), redirect to tabs
  if (!budgetLoading && budget) {
    return <Redirect href={"/(tabs)"} />;
  }

  useEffect(() => {
    if (user?.income != null && income === null) {
      setIncome(user.income);
    }
  }, [user?.income]);

  // if (isLoading) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         backgroundColor: backgroundColor,
  //         alignItems: "center",
  //         justifyContent: "center",
  //         gap: 12,
  //       }}
  //     >
  //       <ActivityIndicator size="large" />

  //       <Text style={{ color: textColor }}>Loading income disclosure...</Text>
  //     </View>
  //   );
  // }

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
      await updateUserIncome(income);
      router.push("/(setup)/lifestyle-survey");
    } catch (error) {
      console.error("Error updating income:", error);
      alert("There was an error updating your income. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
        <Card.Title
          title="Income Disclosure"
          titleStyle={{
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
          }}
        />
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
