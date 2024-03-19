import { useState, type FC } from "react";
import { Button, List } from "antd";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { type SerializedEditorState } from "lexical";
import { type Comment as CommentStore } from "../stores/Comment";
import { useGetPostComments } from "../hooks/useGetPostComments";
import { groupBy, sortBy } from "lodash";
import { CreateCommentForm } from "./CreateCommentForm";
import { Author } from "./Author";

export const Comment: FC<{ comment: CommentStore; level?: number }> = ({
  comment,
  level = 0,
}) => {
  const [responseVisible, setResponseVisible] = useState(false);
  const comments = useGetPostComments(comment.postId);
  const childrenComments = sortBy(
    groupBy(comments, "parentId")[comment.id],
    "createdAt",
  );

  return (
    <List.Item>
      <div data-level={level}>
        <div>
          <LexicalComposer
            initialConfig={{
              namespace: "comment-content",
              editable: false,
              editorState(editor) {
                const state = editor.parseEditorState(
                  comment.content as SerializedEditorState,
                );

                editor.setEditorState(state);
              },
              onError(e) {
                console.error(e);
              },
            }}
          >
            <RichTextPlugin
              placeholder={null}
              contentEditable={<ContentEditable />}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </LexicalComposer>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <Author item={comment} />
        </div>
        <div>
          {responseVisible ? (
            <Button
              size="small"
              onClick={(e) => {
                e.preventDefault();

                setResponseVisible(false);
              }}
            >
              Отмена
            </Button>
          ) : (
            <Button
              size="small"
              onClick={(e) => {
                e.preventDefault();

                setResponseVisible(true);
              }}
            >
              Ответить
            </Button>
          )}
        </div>
        {responseVisible && (
          <div>
            <CreateCommentForm
              postId={comment.postId}
              parentId={comment.id}
              onSuccess={() => {
                setResponseVisible(false);
              }}
            />
          </div>
        )}
        {childrenComments && (
          <div style={{ marginLeft: (level + 1) * 20 }}>
            <List>
              {childrenComments.map((comment) => (
                <Comment key={comment.id} comment={comment} level={level + 1} />
              ))}
            </List>
          </div>
        )}
      </div>
    </List.Item>
  );
};
