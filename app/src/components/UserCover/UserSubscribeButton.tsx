import { type FC } from "react";
import { Button } from "antd";
import { type User as UserStore } from "../../stores/User";
import { useUserSubscription } from "../../hooks/useUserSubscription";

export const UserSubscribeButton: FC<{ user: UserStore }> = ({ user }) => {
  const { subscribe, unsubscribe } = useUserSubscription(user);

  if (user.subscribed) {
    return (
      <Button
        danger
        onClick={(e) => {
          e.preventDefault();

          unsubscribe();
        }}
      >
        Отписаться
      </Button>
    );
  } else {
    return (
      <Button
        onClick={(e) => {
          e.preventDefault();

          subscribe();
        }}
      >
        Подписаться
      </Button>
    );
  }
};
