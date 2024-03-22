import { observer } from "mobx-react-lite";
import { UserProfileForm as UserProfileFormStore } from "../../stores/UserProfileForm";
import { Button, Form, Input } from "antd";
import { DatePicker } from '../DatePicker'
import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "../../hooks/useApiClient";

export const ProfileForm = observer(
  ({ profile }: { profile: UserProfileFormStore }) => {
    const apiClient = useApiClient()
    const [form] = Form.useForm();
    const { mutate: save } = useMutation({
      async mutationFn() {
        await apiClient.post('/users/me/profile', profile)
      }
    })

    return (
      <Form
        form={form}
        layout="vertical"
        initialValues={profile}
        variant="filled"
        onFinish={({
          bio,
          firstName,
          lastName,
          dateOfBirth,
          country,
          city,
        }: {
          bio: string;
          firstName: string;
          lastName: string;
          dateOfBirth: Date;
          country: string;
          city: string;
        }) => {
          profile.setBio(bio);
          profile.setFirstName(firstName);
          profile.setLastName(lastName);
          profile.setDateOfBirth(dateOfBirth);
          profile.setCountry(country);
          profile.setCity(city);

          save()
        }}
      >
        <Form.Item label="Краткая биография" name="bio">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Имя" name="firstName">
          <Input />
        </Form.Item>
        <Form.Item label="Фамилия" name="lastName">
          <Input />
        </Form.Item>
        <Form.Item label="Дата рождения" name="dateOfBirth">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Страна" name="country">
          <Input />
        </Form.Item>
        <Form.Item label="Город" name="city">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    );
  },
);
