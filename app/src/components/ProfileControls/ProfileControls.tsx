import { type FC } from "react";
import { Space } from "antd";
import { Root } from "./styled";
import { UpdateImageButton } from "./UpdateImageButton";

export const ProfileControls: FC<{ onChange(): void }> = ({ onChange }) => {
  return (
    <Root>
      <Space direction="horizontal" size={10}>
        <UpdateImageButton type="avatar" onChange={onChange}>
          Обновить аватарку
        </UpdateImageButton>
        <UpdateImageButton type="cover" onChange={onChange}>
          Обновить подложку
        </UpdateImageButton>
      </Space>
    </Root>
  );
};
