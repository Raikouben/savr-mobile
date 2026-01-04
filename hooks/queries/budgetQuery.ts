import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBudget } from "../useBudget";
import { use } from "react";

export const useBudgetQuery = () => {
  const { getBudget } = useBudget();
  return useQuery({
    queryKey: ["budget"],
    queryFn: getBudget,
  });
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
