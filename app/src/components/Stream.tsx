import { ReactNode, type FC } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Empty, Pagination } from "antd";
import { Post as PostStore } from "../stores/Post";
import type {
  Paginated,
  Stream as StreamType,
  Post as PostType,
} from "@task-2/service/types";
import { useApiClient } from "../hooks/useApiClient";
import { Post } from "./Post";
import { Stream as StreamStore } from "../stores/Stream";

const LIMIT = 10;

export const Stream: FC<{
  page: number;
  slug: string;
  title?(stream: StreamStore): ReactNode;
  onPageChange(page: number): void;
}> = ({ page, slug, title, onPageChange }) => {
  const apiClient = useApiClient();
  const { data: stream } = useSuspenseQuery({
    queryKey: ["streams", { slug }],
    async queryFn() {
      const { data } = await apiClient.get<StreamType>("/streams", {
        params: { slug },
      });

      return data;
    },
    select(data) {
      return new StreamStore(data);
    },
  });
  const { data: posts } = useSuspenseQuery({
    queryKey: [
      "streams",
      stream.id,
      "posts",
      { limit: LIMIT, offset: page * LIMIT },
    ],
    async queryFn() {
      const { data } = await apiClient.get<Paginated<PostType>>(
        `/streams/${stream.id}/posts`,
        {
          params: { limit: LIMIT, offset: page * LIMIT },
        },
      );

      return data;
    },
    select(data) {
      return {
        ...data,
        items: data.items.map((post) => new PostStore(post)),
      };
    },
  });

  if (posts.total === 0) {
    return (
      <div>
        {title && title(stream)}
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет постов" />
      </div>
    );
  }

  return (
    <div>
      {title && title(stream)}
      <div>
        {posts.items.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
      {posts.total > LIMIT && (
        <div style={{ marginTop: 10 }}>
          <Pagination
            showSizeChanger={false}
            defaultCurrent={page}
            total={100 ?? posts.total}
            onChange={(nextPage) => {
              onPageChange(nextPage);
            }}
          />
        </div>
      )}
    </div>
  );
};
