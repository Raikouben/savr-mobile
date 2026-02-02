import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import { API_URL } from "@/constants/config";

export const useReport = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      console.log("Fetching reports from:", `${API_URL}/reports`);
      const response = await fetch(`${API_URL}/reports`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Reports response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Reports error response:", errorText);
        throw new Error(errorText);
      }
      const data = await response.json();
      console.log("Reports data received:", data);
      return data;
    } catch (err: any) {
      console.log("Reports fetch error:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const markReportAsViewed = async (id: number) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/reports/${id}/viewed`, {
        method: "PATCH",
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
  const getReport = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/reports/${id}`, {
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
    getReports,
    getReport,
    markReportAsViewed,
    loading,
    error,
  };
};
