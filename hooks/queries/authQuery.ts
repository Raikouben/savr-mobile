import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

export const useUserQuery = () => {
  const { getUser, updateUser } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
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
  };
};

