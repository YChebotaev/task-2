import { useQueryClient, useMutation } from "@tanstack/react-query";
import { User } from "../stores/User";
import { useApiClient } from "./useApiClient";

export const useUserSubscription = (user: User) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  const { mutate: subscribe } = useMutation({
    async mutationFn() {
      await apiClient.post(`/users/${user.id}/subscribe`);
    },
    onSuccess() {
      user.subscribe();

      queryClient.invalidateQueries({
        queryKey: ["users", user.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", "me", "subscriptions"],
      });
    },
  });
  const { mutate: unsubscribe } = useMutation({
    async mutationFn() {
      await apiClient.post(`/users/${user.id}/unsubscribe`);
    },
    onSuccess() {
      user.unsubscribe();

      queryClient.invalidateQueries({
        queryKey: ["users", "me", "subscriptions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", user.id],
      });
    },
  });

  return {
    subscribe,
    unsubscribe,
  };
};
