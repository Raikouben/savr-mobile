import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSubscription } from "../useSubscription";

export const useSubscriptionQuery = (subscriptionId?: number) => {
  const {
    getSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  } = useSubscription();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: (subscriptionData: {
      name: string;
      amount: number;
      category: string;
      billing_cycle: string;
      next_billing_date: string;
    }) => createSubscription(subscriptionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: (subscriptionData: {
      id: number;
      name: string;
      amount: number;
      category: string;
      billing_cycle: string;
      next_billing_date: string;
    }) => updateSubscription(subscriptionData.id, subscriptionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });

  const deleteSubscriptionMutation = useMutation({
    mutationFn: (id: number) => deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
  return {
    subscriptions: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createSubscription: createSubscriptionMutation.mutateAsync,
    updateSubscription: updateSubscriptionMutation.mutateAsync,
    deleteSubscription: deleteSubscriptionMutation.mutateAsync,
  };
};
