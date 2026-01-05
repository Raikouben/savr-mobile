import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecommender } from "../useRecommender";

export const useSurveyQuery = () => {
  const { getLifestyleAnswers, updateLifestyleAnswers } = useRecommender();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["lifestyleSurvey"],
    queryFn: getLifestyleAnswers,
  });

  const updateMutation = useMutation({
    mutationFn: updateLifestyleAnswers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lifestyleSurvey"] });
    },
  });
  return {
    surveyAnswers: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    updateSurveyAnswers: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};
