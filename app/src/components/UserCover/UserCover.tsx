import { type FC } from "react";
import { Button, Space, Typography } from "antd";
import { Root, Avatar, InnerContainer } from "./styled";
import { type User as UserStore } from "../../stores/User";
import { UserSubscribeButton } from "./UserSubscribeButton";
import { useUser } from "../UserProvider";
import { useNavigate } from "react-router";

export const UserCover: FC<{ myself?: boolean; user: UserStore }> = ({
  myself = false,
  user,
}) => {
  const navigate = useNavigate();
  const me = useUser();
  const isAuthenticated = Boolean(me);

  return (
    <Root $backgroundImage={user.coverSrc}>
      <InnerContainer>
        <Avatar $src={user.avatarSrc} />
        <Typography.Text>{user.username}</Typography.Text>
        <Space direction="horizontal" size={10}>
          {!myself && isAuthenticated && <UserSubscribeButton user={user} />}
          {!myself && (
            <Button
              href={`/dm/${user.id}`}
              onClick={(e) => {
                e.preventDefault();

                navigate(`/dm/${user.id}`);
              }}
            >
              Написать сообщение
            </Button>
          )}
        </Space>
      </InnerContainer>
    </Root>
  );
};
