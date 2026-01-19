import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBudget } from "../useBudget";
import { isClerkAPIResponseError } from "@clerk/clerk-expo";

export const useBudgetQuery = () => {
  const {
    getBudget,
    updateBudget,
    createBudget,
    // getPastBudgets,
  } = useBudget();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["budget"],
    queryFn: getBudget,
    retry: false, // Don't retry on 404 errors
  });

  const createMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
  });

  // const getPastBudgetsQuery = useQuery({
  //   queryKey: ["pastBudgets"],
  //   queryFn: getPastBudgets,
  //   retry: false, // Don't retry on 404 errors
  // });

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
