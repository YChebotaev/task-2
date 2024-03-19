import { type FC } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { type Post as PostStore } from "../stores/Post";
import { type Comment as CommentStore } from "../stores/Comment";
import { User as UserStore } from "../stores/User";
import { useApiClient } from "../hooks/useApiClient";
import { Typography } from "antd";
import { Link } from "react-router-dom";

export const Author: FC<{ item: PostStore | CommentStore }> = ({ item }) => {
  const apiClient = useApiClient();
  const { data: user } = useSuspenseQuery({
    queryKey: ["users", item.authorId],
    async queryFn() {
      const { data } = await apiClient.get(`/users/${item.authorId}`);

      return data;
    },
    select(data) {
      return new UserStore(data);
    },
  });

  return (
    <Typography.Text>
      Написал <Link to={`/u/${user.username}`}>{user.username}</Link>{" "}
      <span title={format(item.createdAt, "dd.MM.yyyy")}>
        {formatDistanceToNow(item.createdAt, { locale: ru })} назад, в{" "}
      </span>
      {format(item.createdAt, "HH:mm")}
    </Typography.Text>
  );
};
