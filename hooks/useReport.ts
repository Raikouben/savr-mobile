import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import { API_URL } from "@/constants/config";

export const useReport = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getReport = async (reportId: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/reports`, {
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
  return {
    getReport,
    loading,
    error,
  };
};
