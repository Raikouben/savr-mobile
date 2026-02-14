import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import { API_URL } from "@/constants/config";

export const useSubscription = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/subscriptions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

  const createSubscription = async (subscriptionData: {
    name: string;
    amount: number;
    category: string;
    billing_cycle: string;
    next_billing_date: string;
  }) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionData),
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
    }
  };

  const deleteSubscription = async (id: number) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/subscriptions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
    }
  };

  const updateSubscription = async (
    id: number,
    subscriptionData: {
      name?: string;
      amount?: number;
      category?: string;
      billing_cycle?: string;
      next_billing_date?: string;
    },
  ) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/subscriptions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionData),
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
    }
  };

  return {
    getSubscriptions,
    createSubscription,
    deleteSubscription,
    updateSubscription,
    loading,
    error,
  };
};
