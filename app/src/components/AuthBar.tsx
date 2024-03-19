import { Button, Space, Typography } from "antd";
import { type FC } from "react";
import { useUser } from "./UserProvider";
import { useNavigate } from "react-router";

export const AuthBar: FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const isAuthenticated = Boolean(user);

  if (isAuthenticated) {
    // TODO: To implement...
    return (
      <Typography.Text style={{ color: "white " }}>
        Привет, {user.username}
      </Typography.Text>
    );
  } else {
    return (
      <Space direction="horizontal" size={10}>
        <Button
          href="/auth/signin"
          onClick={(e) => {
            e.preventDefault();

            navigate("/auth/signin");
          }}
        >
          Войти
        </Button>
        <Button
          type="primary"
          href="/auth/signup"
          onClick={(e) => {
            e.preventDefault();

            navigate("/auth/signup");
          }}
        >
          Зарегистрироваться
        </Button>
      </Space>
    );
  }
};
