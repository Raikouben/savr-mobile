import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBudget } from "../useBudget";

export const useBudgetQuery = () => {
  const { getBudget, updateBudget} = useBudget();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["budget"],
    queryFn: getBudget,
  });

  const updateMutation = useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
  });

  return {
    budget: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    updateBudget: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};

export function useUpdateBudgetQuery() {
  const { updateBudget } = useBudget();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
  });
}
