import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTransactions } from "../useTransactions";

export const useTransactionQuery = () => {
  const { getTransactions, createTransaction, createBulkTransactions } =
    useTransactions();
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

  const createBulkMutation = useMutation({
    mutationFn: createBulkTransactions,
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
    createBulkTransactions: createBulkMutation.mutateAsync,
    isCreatingBulk: createBulkMutation.isPending,
  };
};
