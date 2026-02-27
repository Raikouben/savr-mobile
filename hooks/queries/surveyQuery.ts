import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecommender } from "../useRecommender";

export const useSurveyQuery = () => {
  const { getLifestyleAnswers, updateLifestyleAnswers, postLifestyleAnswers } =
    useRecommender();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["lifestyleSurvey"],
    queryFn: getLifestyleAnswers,
    retry: false, // Don't retry on 404 errors
  });

  const createMutation = useMutation({
    mutationFn: postLifestyleAnswers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lifestyleSurvey"] });
    },
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
    submitSurveyAnswers: createMutation.mutateAsync,
    updateSurveyAnswers: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isSubmitting: createMutation.isPending,
  };
};
