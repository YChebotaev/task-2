import { useState, type FC } from "react";
import { useNavigate } from "react-router";
import { Button, Card, Form, Input, Space, Typography } from "antd";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SigninResult, FastifyError } from "@task-2/service/types";
import { useApiClient } from "../hooks/useApiClient";

const INITIAL_VALUES = {
  identity: "",
  password: "",
};

export const SigninForm: FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const [error, setError] = useState<FastifyError | null>(null);
  const { mutate } = useMutation({
    async mutationFn(values: typeof INITIAL_VALUES) {
      const { data } = await apiClient.post<SigninResult>(
        "/auth/signin",
        values,
      );

      return data;
    },
    onMutate() {
      setError(null);
    },
    onSuccess({ accessToken, refreshToken }) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      queryClient.invalidateQueries({
        queryKey: ["users", "me"],
      });

      navigate("/");
    },
    onError(error: AxiosError<FastifyError>) {
      setError(error.response!.data);
    },
  });

  return (
    <Card title="Вход">
      <Form
        form={form}
        layout="vertical"
        initialValues={INITIAL_VALUES}
        variant="filled"
        onFinish={(values: typeof INITIAL_VALUES) => {
          mutate(values);
        }}
      >
        <Form.Item
          label="Емейл или имя пользователя"
          name="identity"
          rules={[
            {
              required: true,
              message: "Поле обязательно для заполнения",
            },
          ]}
        >
          <Input placeholder="Емейл или имя пользователя" />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            {
              required: true,
              message: "Пароль обязателен для заполнения",
            },
          ]}
        >
          <Input.Password placeholder="Пароль" />
        </Form.Item>
        {error && (
          <Form.Item>
            <Typography.Text type="danger">{error.message}</Typography.Text>
          </Form.Item>
        )}
        <Form.Item>
          <Space direction="horizontal" size={2}>
            <Button type="primary" htmlType="submit">
              Войти
            </Button>
            <Button
              type="link"
              href="/auth/signup"
              onClick={(e) => {
                e.preventDefault();

                navigate("/auth/signup");
              }}
            >
              Зарегистрироваться
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
