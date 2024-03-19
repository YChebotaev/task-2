import { type FC } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Post as PostType } from "@task-2/service/types";
import { AppLayout } from "../layouts/AppLayout";
import { useApiClient } from "../hooks/useApiClient";
import { Post as PostStore } from "../stores/Post";
import { Post } from "../components/Post";
import { PostComments } from "../components/PostComments";
import { useUser } from "../components/UserProvider";
import { CreateComment } from "../components/CreateComment";

export const PostCommentsPage: FC = () => {
  const apiClient = useApiClient();
  const { postId: postIdStr } = useParams() as { postId: string };
  const postId = Number(postIdStr);
  const user = useUser();
  const isAuthenticated = Boolean(user);
  const { data: post } = useSuspenseQuery({
    queryKey: ["posts", postId],
    async queryFn() {
      const { data } = await apiClient.get<PostType>(`/posts/${postId}`);

      return data;
    },
    select(data) {
      return new PostStore(data);
    },
  });

  return (
    <AppLayout>
      <Post showComments={false} post={post} />
      {post.commentsCount > 0 && (
        <>
          <div style={{ height: 10 }} />
          <PostComments postId={postId} />
        </>
      )}
      {isAuthenticated && (
        <>
          <div style={{ height: 10 }} />
          <CreateComment postId={postId} />
        </>
      )}
    </AppLayout>
  );
};
