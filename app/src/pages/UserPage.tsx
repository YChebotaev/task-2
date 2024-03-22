import { type FC } from "react";
import { useParams } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { User } from "@task-2/service/types";
import { User as UserStore } from "../stores/User";
import { useApiClient } from "../hooks/useApiClient";
import { AppLayout } from "../layouts/AppLayout";
import { UserCover } from "../components/UserCover";
import { useUser } from "../components/UserProvider";
import { ProfileControls } from "../components/ProfileControls";
import { usePagination } from "../hooks/usePagination";
import { Stream } from "../components/Stream";
import { Typography } from "antd";
import { Profile } from "../components/Profile";

type UserPageParams = {
  username: string;
};

export const UserPage: FC = () => {
  const apiClient = useApiClient();
  const { username } = useParams() as UserPageParams;
  const { page, updatePage } = usePagination();
  const me = useUser();
  const { data: user, refetch } = useSuspenseQuery({
    queryKey: ["users", { username }],
    async queryFn() {
      const { data } = await apiClient.get<User>("/users", {
        params: { username },
      });

      return data;
    },
    select(data) {
      return new UserStore(data);
    },
  });
  const myself = me?.id === user.id;

  return (
    <AppLayout noContentPadding>
      <UserCover myself={myself} user={user} />
      {myself && <ProfileControls onChange={refetch} />}
      <Profile editable={myself} userId={user.id} />
      <div style={{ padding: "1rem" }}>
        <Stream
          page={page}
          slug={user.username}
          onPageChange={updatePage}
          title={(stream) => (
            <Typography.Title level={2}>
              Посты пользователя «{stream.title}»
            </Typography.Title>
          )}
        />
      </div>
    </AppLayout>
  );
};
