import { useSuspenseQuery } from "@tanstack/react-query";
import type { DirectMessage as DirectMessageType } from "@task-2/service/types";
import { DirectMessage as DirectMessageStore } from "../stores/DirectMessage";
import { useApiClient } from "./useApiClient";
import { useSocketIO } from "../components/SocketIOProvider";
import { useEffect } from "react";

export const useChatMessages = (chatId: number) => {
  const apiClient = useApiClient();
  const socket = useSocketIO();
  const { data: messages, refetch } = useSuspenseQuery({
    queryKey: ["chats", chatId, "messages"],
    async queryFn() {
      const { data } = await apiClient.get<DirectMessageType[]>(
        `/chats/${chatId}/messages`,
      );

      return data;
    },
    select(data) {
      return data.map((m) => new DirectMessageStore(m));
    },
  });

  useEffect(() => {
    socket?.on("new-message", () => refetch());

    return () => {
      socket?.off("new-message");
    };
  }, [socket, refetch]);

  return messages;
};
