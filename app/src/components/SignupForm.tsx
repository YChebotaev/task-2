import { useState, type FC } from "react";
import { useNavigate } from "react-router";
import { Button, Card, Form, Input, Space, Typography } from "antd";
import { AxiosError } from "axios";
import { validateUsername } from "@task-2/common/validateUsername";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SignupResult, FastifyError } from "@task-2/service/types";
import { useApiClient } from "../hooks/useApiClient";

const INITIAL_VALUES = {
  username: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

export const SignupForm: FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const queryClient = useQueryClient()
  const [error, setError] = useState<FastifyError | null>(null);
  const { mutate } = useMutation({
    async mutationFn(values: typeof INITIAL_VALUES) {
      const { data } = await apiClient.post<SignupResult>(
        "/auth/signup",
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
        queryKey: ["users", "me"]
      })

      navigate('/')
    },
    onError(error: AxiosError<FastifyError>) {
      setError(error.response!.data);
    },
  });

  return (
    <Card title="Регистрация">
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
          label="Имя пользователя"
          name="username"
          rules={[
            {
              required: true,
              message: "Имя пользователя обязательно для заполнения",
            },
            {
              validator(_, value) {
                if (validateUsername(value)) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error(
                    "Имя пользователя должно начинаться с латинской буквы, содержать только латинские буквы, цифры, и/или символы: «-», «_», «.», и не заканчиваться на один из этих символов: «-», «_», «.»",
                  ),
                );
              },
            },
          ]}
        >
          <Input placeholder="Имя пользователя" />
        </Form.Item>
        <Form.Item
          label="Емейл"
          name="email"
          rules={[
            {
              required: true,
              message: "Емейл обязателен для заполнения",
            },
            {
              type: "email",
              message: "Неверный формат емейла",
            },
          ]}
        >
          <Input placeholder="Емейл" />
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
        <Form.Item
          label="Подтверждение пароля"
          name="passwordConfirm"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Подтверждение пароля обязателено для заполнения",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("Подтверждение должно совпадать с паролем"),
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Подтверждение пароля" />
        </Form.Item>
        {error && (
          <Form.Item>
            <Typography.Text type="danger">{error.message}</Typography.Text>
          </Form.Item>
        )}
        <Form.Item>
          <Space direction="horizontal" size={2}>
            <Button type="primary" htmlType="submit">
              Зарегистрироваться
            </Button>
            <Button
              type="link"
              href="/auth/signin"
              onClick={(e) => {
                e.preventDefault();

                navigate("/auth/signin");
              }}
            >
              Войти
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
