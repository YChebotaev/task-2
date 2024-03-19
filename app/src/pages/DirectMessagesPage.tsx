import { type FC } from "react";
import { useParams } from "react-router";
import { AppLayout } from "../layouts/AppLayout";
import { Chat } from "../components/Chat";

type DirectMessagesPageParams = {
  userId: string;
};

export const DirectMessagesPage: FC = () => {
  const { userId: userIdStr } = useParams() as DirectMessagesPageParams;
  const userId = Number(userIdStr);

  return (
    <AppLayout>
      <Chat recepientId={userId} />
    </AppLayout>
  );
};
