import { useSuspenseQuery } from "@tanstack/react-query";
import type { Comment } from "@task-2/service/types";
import { useApiClient } from "../hooks/useApiClient";
import { Comment as CommentStore } from "../stores/Comment";

export const useGetPostComments = (postId: number) => {
  const apiClient = useApiClient();
  const { data: comments } = useSuspenseQuery({
    queryKey: ["posts", postId, "comments"],
    async queryFn() {
      const { data } = await apiClient.get<Comment[]>(
        `/posts/${postId}/comments`,
      );

      return data;
    },
    select(data) {
      return data.map((c) => new CommentStore(c));
    },
  });

  return comments;
};
