import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View, ScrollView } from "react-native";
import { use, useState } from "react";
import { SignOutButton } from "../../components/SignOutButton";
import { useEffect } from "react";
import { useBudget } from "../../hooks/useBudget";
import { useTransactions } from "../../hooks/useTransactions";
import { useAuth } from "../../hooks/useAuth";
import {
  calculateBudgetSummary,
  calculateTotalBudgetComparison,
} from "../../utils/calculation";
import { AnimatedCircularProgress } from "react-native-circular-progress";

export default function Page() {
  const { user } = useUser();
  const clerkId = user?.id;
  const { getUser } = useAuth();
  const { getBudget } = useBudget();
  const { getTransactions } = useTransactions();
  const [neonUser, setNeonUser] = useState<any | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [overview, setOverview] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[] | null>(null);
  const [budgetSummary, setBudgetSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (clerkId) {
          const neonUser = await getUser();
          setNeonUser(neonUser);

          const budgetData = await getBudget();
          setBudget(budgetData);

          const transactionsData = await getTransactions();
          setTransactions(transactionsData);

          const summary = calculateBudgetSummary(budgetData, transactionsData);
          setBudgetSummary(summary);

          const totalBudgetComparison = calculateTotalBudgetComparison(
            budgetData,
            transactionsData
          );
          setOverview(totalBudgetComparison);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clerkId]);

  return (
    <ScrollView>
      <Text>HomeScreen</Text>
      <AnimatedCircularProgress
        size={200}
        width={12}
        fill={
          overview && overview.totalBudget > 0
            ? Math.min((overview.totalSpent / overview.totalBudget) * 100, 100)
            : 0
        }
        tintColor={
          overview && overview.totalBudget > 0
            ? overview.totalSpent / overview.totalBudget < 0.5
              ? "#4caf50"
              : overview.totalSpent / overview.totalBudget < 0.75
              ? "#ffeb3b"
              : overview.totalSpent / overview.totalBudget < 1
              ? "#ff9800"
              : "#e53935"
            : "#4caf50"
        }
        backgroundColor="white"
      >
        {(fill: number) => (
          <Text style={{ color: "white", fontSize: 22 }}>{`${Math.round(
            fill
          )}%`}</Text>
        )}
      </AnimatedCircularProgress>
    </ScrollView>
  );
}
