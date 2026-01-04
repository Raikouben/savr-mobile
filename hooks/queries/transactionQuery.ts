import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTransactions } from "../useTransactions";

export const useTransactionQuery = () => {
  const { getTransactions } = useTransactions();
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
};

export function useCreateTransaction() {
  const { createTransaction } = useTransactions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
