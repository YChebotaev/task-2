import { useSuspenseQuery } from "@tanstack/react-query";
import type { Chat as ChatType } from "@task-2/service/types";
import { useApiClient } from "./useApiClient";
import { useSocketIO } from "../components/SocketIOProvider";
import { useEffect } from "react";

export const useChats = () => {
  const apiClient = useApiClient();
  const socket = useSocketIO()
  const { data: chats, refetch } = useSuspenseQuery({
    queryKey: ["users", "me", "chats"],
    async queryFn() {
      const { data } = await apiClient.get<ChatType[]>("/users/me/chats");

      return data;
    },
  });

  useEffect(() => {
    socket?.on('new-message', () => refetch())

    return () => {
      socket?.off('new-message')
    }
  }, [socket, refetch])

  return chats
}
