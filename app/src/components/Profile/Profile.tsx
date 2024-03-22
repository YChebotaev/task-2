import { type FC } from "react";
import { Empty, Typography } from "antd";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { UserProfile } from "@task-2/service/types";
import { UserProfile as UserProfileStore } from "../../stores/UserProfile";
import { UserProfileForm as UserProfileFormStore } from "../../stores/UserProfileForm";
import { Root } from "./styled";
import { useApiClient } from "../../hooks/useApiClient";
import { ProfileForm } from "./ProfileForm";
import { Field } from "./Field";
import { format } from "date-fns";

export const Profile: FC<{ editable: boolean; userId: number }> = ({
  editable,
  userId,
}) => {
  const apiClient = useApiClient();
  const { data: profile } = useSuspenseQuery({
    queryKey: ["users", userId, "profile"],
    async queryFn() {
      const { data } = await apiClient.get<UserProfile>(
        `/users/${userId}/profile`,
      );

      return data;
    },
    select(data) {
      if (editable) {
        return new UserProfileFormStore(data);
      } else {
        return new UserProfileStore(data);
      }
    },
  });

  if (editable) {
    if (editable) {
      return (
        <Root>
          <ProfileForm profile={profile as UserProfileFormStore} />
        </Root>
      );
    }
  }

  if (profile.isEmpty()) {
    return (
      <Root>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Typography.Text>Пользователь не заполнил профиль</Typography.Text>
          }
        />
      </Root>
    );
  }

  return (
    <Root>
      <Field label="Краткая биография">{profile.bio}</Field>
      <Field label="Имя">{profile.firstName}</Field>
      <Field label="Фамилия">{profile.lastName}</Field>
      <Field label="Дата рождения">
        {format(profile.dateOfBirth, "dd.MM.yyyy")}
      </Field>
      <Field label="Страна">{profile.country}</Field>
      <Field label="Город">{profile.city}</Field>
    </Root>
  );
};
