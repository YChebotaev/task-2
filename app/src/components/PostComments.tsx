import { type FC } from "react";
import { groupBy, sortBy } from "lodash";
import { Card, List } from "antd";
import { useGetPostComments } from "../hooks/useGetPostComments";
import { Comment } from "./Comment";

export const PostComments: FC<{ postId: number }> = ({ postId }) => {
  const comments = useGetPostComments(postId);
  const rootComments = sortBy(
    groupBy(comments, "parentId")["null"],
    "createdAt",
  );

  return (
    <Card title="Комментарии">
      <List>
        {rootComments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </List>
    </Card>
  );
};
