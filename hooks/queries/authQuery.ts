import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

export const useAuthQuery = () => {
  const { getUser } = useAuth();
  return useQuery({
    queryKey: ["auth"],
    queryFn: getUser,
  });
};

export function useUpdateUserQuery() {
  const { updateUser } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
