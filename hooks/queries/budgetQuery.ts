import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBudget } from "../useBudget";
import { isClerkAPIResponseError } from "@clerk/clerk-expo";

export const useBudgetQuery = () => {
  const { getBudget, updateBudget, createBudget } = useBudget();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["budget"],
    queryFn: getBudget,
  });

  const createMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
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
    createBudget: createMutation.mutateAsync,
    updateBudget: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
  };
};

