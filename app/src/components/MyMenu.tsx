import { type FC } from "react";
import { Menu } from "antd";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { MySubscriptionsResult } from "@task-2/service/types";
import type { Chat } from "@task-2/service/types";
import { useApiClient } from "../hooks/useApiClient";
import { useUser } from "./UserProvider";

export const MyMenu: FC = () => {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const isAuthenticated = Boolean(useUser());
  const { data: subscriptions } = useSuspenseQuery({
    queryKey: ["users", "me", "subscriptions"],
    async queryFn() {
      const { data } = await apiClient.get<MySubscriptionsResult>(
        "/users/me/subscriptions",
      );

      return data;
    },
  });
  const { data: chats } = useSuspenseQuery({
    queryKey: ["users", "me", "chats"],
    async queryFn() {
      const { data } = await apiClient.get<Chat[]>("/users/me/chats");

      return data;
    },
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Menu
      theme="dark"
      mode="inline"
      items={[
        {
          key: "streams",
          type: "group",
          label: "Стримы",
          children:
            subscriptions.stream?.map(({ id, title }) => ({
              key: `stream:${id}`,
              label: title,
            })) ?? [],
        },
        {
          key: "users",
          type: "group",
          label: "Пользователи",
          children:
            subscriptions.user?.map(({ id, title }) => ({
              key: `user:${id}`,
              label: title,
            })) ?? [],
        },
        {
          key: "tags",
          type: "group",
          label: "Теги",
          children:
            subscriptions.tag?.map(({ id, title }) => ({
              key: `tag:${id}`,
              label: title,
            })) ?? [],
        },
        {
          key: "chats",
          type: "group",
          label: "Личные сообщения",
          children: chats.map(({ id, recepient }) => ({
            key: `chat:${id}`,
            label: recepient.username,
          })),
        },
      ]}
      onSelect={({ key }) => {
        const [type, id] = key.split(":");
        let href: string;

        switch (type) {
          case "stream": {
            const stream = subscriptions.stream?.find(
              (s) => String(s.id) === id,
            );

            href = `/${stream?.slug}`;

            break;
          }
          case "user": {
            const user = subscriptions.user?.find((u) => String(u.id) === id);

            href = `/u/${user?.slug}`;

            break;
          }
          case "tag": {
            const tag = subscriptions.tag?.find((t) => String(t.id) === id);

            href = `/t/${tag?.slug}`;

            break;
          }
          case "chat": {
            const chat = chats.find((c) => String(c.id) === id);

            href = `/dm/${chat?.recepient.id}`;

            break;
          }
        }

        if (href!) {
          navigate(href);
        }
      }}
    />
  );
};
