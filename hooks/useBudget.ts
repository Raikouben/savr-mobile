import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import { API_URL } from "@/constants/config";

export const useBudget = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBudget = async (budget: {
    housing: number;
    utilities: number;
    transportation: number;
    groceries: number;
    eating_out: number;
    shopping: number;
    health: number;
    entertainment: number;
    savings: number;
    debt: number;
    miscellaneous: number;
    total_budget: number;
    start_date: string;
    end_date: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(budget),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBudget = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/budgets/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (budget: {
    housing: number;
    utilities: number;
    transportation: number;
    groceries: number;
    eating_out: number;
    shopping: number;
    health: number;
    entertainment: number;
    savings: number;
    debt: number;
    miscellaneous: number;
    total_budget: number;
    start_date: string;
    end_date: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/budgets/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(budget),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBudgetAdvice = async (
    category: string,
    budgetAmount: number,
    actualSpent: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/budgets/advice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category, budgetAmount, actualSpent }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // const getPastBudgets = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const token = await getToken();
  //     const response = await fetch(`${API_URL}/budgets/past`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(errorText);
  //     }
  //     const data = await response.json();
  //     return data;
  //   } catch (err: any) {
  //     setError(err.message);
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return {
    loading,
    error,
    createBudget,
    getBudget,
    updateBudget,
    getBudgetAdvice,
    // getPastBudgets,
  };
};
