import { Button, Card, Tag } from "antd";
import { observer } from "mobx-react-lite";
import { Link, useNavigate } from "react-router-dom";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { type SerializedEditorState } from "lexical";
import { type Post as PostStore } from "../stores/Post";
import { Author } from "./Author";

export const Post = observer(
  ({
    showComments = true,
    post,
  }: {
    showComments?: boolean;
    post: PostStore;
  }) => {
    const navigate = useNavigate();

    return (
      <Card
        key={post.id}
        title={post.title}
        actions={
          showComments
            ? [
                <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                  <Button
                    href={`/p/${post.id}`}
                    onClick={(e) => {
                      e.preventDefault();

                      navigate(`/p/${post.id}`);
                    }}
                  >
                    Комментарии ({post.commentsCount})
                  </Button>
                </div>,
              ]
            : undefined
        }
      >
        <div>
          {post.tags.map(({ id, title, slug }) => (
            <Tag key={id}>
              <Link to={`/t/${slug}`}>{title}</Link>
            </Tag>
          ))}
        </div>
        <div>
          <LexicalComposer
            initialConfig={{
              namespace: "post-content",
              editable: false,
              editorState(editor) {
                const state = editor.parseEditorState(
                  post.content as SerializedEditorState,
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
        <div>
          <Author item={post} />
        </div>
      </Card>
    );
  },
);
