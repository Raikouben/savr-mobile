import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTransactions } from "../useTransactions";

export const useTransactionQuery = () => {
  const { getTransactions, createTransaction } = useTransactions();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
  });

  return {
    transactions: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    createTransaction: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
};

export function useCreateTransactionQuery() {
  const { createTransaction } = useTransactions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
