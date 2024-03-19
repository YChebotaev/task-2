import { useState, type FC } from "react";
import { Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { EditorPlaceholder } from "./EditorPlaceholder";
import { SerializedEditorState } from "lexical";
import { useApiClient } from "../hooks/useApiClient";

export const CreateCommentForm: FC<{
  postId: number;
  parentId?: number;
  onSuccess?(): void;
}> = ({ postId, parentId, onSuccess }) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const [content, setContent] = useState<SerializedEditorState>();
  const { mutate } = useMutation({
    async mutationFn() {
      const { data } = await apiClient.post(`/posts/${postId}/comments`, {
        parentId,
        content,
      });

      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
      queryClient.invalidateQueries({
        queryKey: ["posts", postId, "comments"],
      });
      setContent(undefined);

      onSuccess && onSuccess();
    },
  });

  return (
    <div>
      <LexicalComposer
        initialConfig={{
          namespace: "edit-post",
          onError(e) {
            console.error(e);
          },
        }}
      >
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={
            <EditorPlaceholder>Начните вводить текст...</EditorPlaceholder>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          onChange={(editorState) => {
            setContent(editorState.toJSON());
          }}
        />
      </LexicalComposer>
      <div>
        <Button
          disabled={content == null}
          type="primary"
          onClick={(e) => {
            e.preventDefault();

            mutate();
          }}
        >
          Добавить комментарий
        </Button>
      </div>
    </div>
  );
};
