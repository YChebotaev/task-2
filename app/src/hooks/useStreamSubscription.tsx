import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";
import { Stream } from "../stores/Stream";

export const useStreamSubscription = (
  stream: Stream,
  type: "tag" | "stream",
) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  const { mutate: subscribe } = useMutation({
    async mutationFn() {
      await apiClient.post(`/streams/${stream.id}/subscribe`, { type });
    },
    onSuccess() {
      stream.subscribe();

      queryClient.invalidateQueries({
        queryKey: ["streams", { slug: stream.slug }],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", "me", "subscriptions"],
      });
    },
  });
  const { mutate: unsubscribe } = useMutation({
    async mutationFn() {
      await apiClient.post(`/streams/${stream.id}/unsubscribe`, { type });
    },
    onSuccess() {
      stream.unsubscribe();

      queryClient.invalidateQueries({
        queryKey: ["streams", { slug: stream.slug }],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", "me", "subscriptions"],
      });
    },
  });

  return {
    subscribe,
    unsubscribe,
  };
};
