import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import { useAuth as useClerkAuth } from "@clerk/clerk-expo";

export const useUserQuery = () => {
  const {
    getUser,
    updateUser,
    updateUserIncome,
    updateUserLoggedInfo,
    resetStreak,
  } = useAuth();
  const { isSignedIn } = useClerkAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: !!isSignedIn,
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

  const updateLoggedInfoMutation = useMutation({
    mutationFn: updateUserLoggedInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const resetStreakMutation = useMutation({
    mutationFn: resetStreak,
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
    updateUserLoggedInfo: updateLoggedInfoMutation.mutateAsync,
    isUpdatingLoggedInfo: updateLoggedInfoMutation.isPending,
    resetStreak: resetStreakMutation.mutateAsync,
    isResettingStreak: resetStreakMutation.isPending,
  };
};
