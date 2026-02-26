import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTransactions } from "../useTransactions";
import { useAuth } from "@clerk/clerk-expo";

export const useTransactionQuery = () => {
  const {
    getTransactions,
    createTransaction,
    createBulkTransactions,
    deleteTransaction,
  } = useTransactions();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    enabled: !!isSignedIn,
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

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
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
    deleteTransaction: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
