import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

export const useUserQuery = () => {
  const { getUser, updateUser, updateUserIncome } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 0, // Always refetch on mount
    refetchOnMount: true,
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const updateIncomeMutation = useMutation({
    mutationFn: updateUserIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    updateUser: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateUserIncome: updateIncomeMutation.mutateAsync,
    isUpdatingIncome: updateIncomeMutation.isPending,
  };
};
