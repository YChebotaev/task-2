import { useMemo, type FC } from "react";
import { EditorLayout } from "../layouts/EditorLayout";
import { EditPostForm } from "../components/EditPostForm";
import { PostForm } from "../stores/PostForm";

export const CreatePage: FC = () => {
  const post = useMemo(
    () => new PostForm({ title: "", content: {}, tags: [] }),
    [],
  );

  return (
    <EditorLayout>
      <EditPostForm post={post} />
    </EditorLayout>
  );
};
