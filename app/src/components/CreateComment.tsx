import { type FC } from "react";
import { Card } from "antd";
import { CreateCommentForm } from "./CreateCommentForm";

export const CreateComment: FC<{ postId: number }> = ({ postId }) => (
  <Card title="Оставить комментарий">
    <CreateCommentForm postId={postId} />
  </Card>
);
