import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View, ScrollView } from "react-native";
import { use, useState } from "react";
import { SignOutButton } from "../../components/SignOutButton";
import { useEffect } from "react";
import { useBudget } from "../../hooks/useBudget";
import { useTransactions } from "../../hooks/useTransactions";
import { useAuth } from "../../hooks/useAuth";
import { calculateBudgetSummary } from "../../utils/calculation";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Page() {
  const { user } = useUser();
  const clerkId = user?.id;
  const { getUser } = useAuth();
  const { getBudget } = useBudget();
  const { getTransactions } = useTransactions();
  const [neonUser, setNeonUser] = useState<any | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
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
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clerkId]);

  return <ScrollView></ScrollView>;
}
