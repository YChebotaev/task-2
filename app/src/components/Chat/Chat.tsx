import { FC, useEffect, useState } from "react";
import { Button, Empty, Typography } from "antd";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { type SerializedEditorState } from "lexical";
import type { Chat as ChatType } from "@task-2/service/types";
import {
  Root,
  MessagesContainer,
  InputContainer,
  EmptyContainer,
} from "./styled";
import { useApiClient } from "../../hooks/useApiClient";
import { Message } from "./Message/Message";
import { EditorPlaceholder } from "../EditorPlaceholder";
import { useChatMessages } from "../../hooks/useChatMessages";
import { Chat as ChatStore } from "../../stores/Chat";

export const Chat: FC<{ recepientId: number }> = ({ recepientId }) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const [content, setContent] = useState<SerializedEditorState | null>(null);
  const { data: chat } = useSuspenseQuery({
    queryKey: ["users", recepientId, "chat"],
    async queryFn() {
      const { data } = await apiClient.get<ChatType>(
        `/users/${recepientId}/chat`,
      );

      return data;
    },
    select(data) {
      return new ChatStore(data);
    },
  });
  const messages = useChatMessages(chat.id);
  const { mutate: send } = useMutation({
    async mutationFn() {
      const { data } = await apiClient.post(`/chats/${chat.id}/messages`, {
        content,
        recepientId,
      });

      return data;
    },
    onSuccess() {
      if (chat.id === -1) {
        queryClient.invalidateQueries({
          queryKey: ["users", recepientId, "chat"],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["chats", chat.id, "messages"],
      });
    },
  });
  const { mutate: markRead } = useMutation({
    async mutationFn() {
      await apiClient.post(`/chats/${chat.id}/messages/mark_read`);
    },
  });

  useEffect(() => {
    markRead();
  }, [markRead]);

  return (
    <Root>
      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyContainer>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Typography.Text>Пока нет сообщений</Typography.Text>
              }
            />
          </EmptyContainer>
        ) : (
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}
      </MessagesContainer>
      <InputContainer>
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

              send();
            }}
          >
            Отправить
          </Button>
        </div>
      </InputContainer>
    </Root>
  );
};
