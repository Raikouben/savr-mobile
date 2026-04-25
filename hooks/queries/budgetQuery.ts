import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBudget } from "../useBudget";
import { useAuth } from "@clerk/clerk-expo";

export const useBudgetQuery = () => {
  const { getBudget, updateBudget, createBudget, getPastBudgets } = useBudget();
  const { isSignedIn, userId } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["budget", userId],
    queryFn: getBudget,
    enabled: !!isSignedIn && !!userId,
    retry: false, // Don't retry on 404 errors
    staleTime: 0,
    refetchOnMount: true,
  });

  const createMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: (data) => {
      if (userId) {
        queryClient.setQueryData(["budget", userId], data);
      }
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
  });

  const getPastBudgetsQuery = useQuery({
    queryKey: ["pastBudgets", userId],
    queryFn: getPastBudgets,
    enabled: !!isSignedIn && !!userId,
    retry: false, // Don't retry on 404 errors
  });

  const updateMutation = useMutation({
    mutationFn: updateBudget,
    onSuccess: (data) => {
      if (userId) {
        queryClient.setQueryData(["budget", userId], data);
      }
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
  });

  return {
    budget: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetched: query.isFetched,
    error: query.error,
    refetch: query.refetch,
    createBudget: createMutation.mutateAsync,
    updateBudget: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
  };
};
