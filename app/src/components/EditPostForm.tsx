import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import { Card, List, Input, Select, Spin, Button } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { Stream } from "@task-2/persistence";
import { useApiClient } from "../hooks/useApiClient";
import { hashCode } from "../lib/hashCode";
import { type PostForm } from "../stores/PostForm";
import { EditorPlaceholder } from './EditorPlaceholder'

type OptionType = {
  value: number;
  label: string;
};

export const EditPostForm = observer(
  ({ post, editMode = false }: { post: PostForm; editMode?: boolean }) => {
    const apiClient = useApiClient();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");
    const { data: options = [], isLoading } = useQuery({
      queryKey: ["streams", { fuzzyTitle: searchValue }],
      enabled: Boolean(searchValue.trim()),
      async queryFn() {
        const { data } = await apiClient.get<Stream[]>("/streams", {
          params: { fuzzyTitle: searchValue },
        });

        return data;
      },
      select(streams) {
        const options: OptionType[] = streams.map(({ id, title }) => ({
          value: id,
          label: title,
        }));

        options.push({
          value: hashCode(searchValue),
          label: searchValue,
        });

        return options;
      },
    });
    const isSaveDisablesd = useMemo(() => {
      if (post.tags.length === 0) {
        return true;
      }

      if (!post.title.trim()) {
        return true;
      }

      if (!post.content) {
        return true;
      }

      return false;
    }, [post.tags, post.title, post.content]);
    const { mutate: save } = useMutation({
      async mutationFn(post: PostForm) {
        await apiClient.post("/posts", post);
      },
      onSuccess() {
        navigate("/");
      },
    });

    return (
      <Card
        title={editMode ? "Редактировать пост" : "Создать пост"}
        style={{ minWidth: 400 }}
      >
        <List>
          <List.Item>
            <Input
              required
              placeholder="Название"
              onChange={(e) => {
                post.setTitle(e.target.value);
              }}
            />
          </List.Item>
          <List.Item>
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
                    <EditorPlaceholder>
                      Начните вводить текст...
                    </EditorPlaceholder>
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <OnChangePlugin
                  onChange={(editorState) => {
                    post.setContent(editorState.toJSON());
                  }}
                />
              </LexicalComposer>
            </div>
          </List.Item>
          <List.Item>
            <Select<OptionType>
              allowClear
              labelInValue
              filterOption={false}
              style={{ width: "100%" }}
              mode="multiple"
              placeholder="Теги"
              options={options}
              notFoundContent={isLoading ? <Spin size="small" /> : null}
              onSearch={(value) => {
                setSearchValue(value);
              }}
              onChange={(_, options) => {
                post.setTags(
                  options.map(({ label }: { label: string }) => label),
                );
              }}
            />
          </List.Item>
          <List.Item>
            <Button
              type="primary"
              disabled={isSaveDisablesd}
              onClick={(e) => {
                e.preventDefault();

                save(post);
              }}
            >
              Опубликовать
            </Button>
          </List.Item>
        </List>
      </Card>
    );
  },
);
