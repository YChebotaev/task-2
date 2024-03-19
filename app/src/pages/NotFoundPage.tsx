import { type FC } from "react";
import { Typography } from "antd";
import { BullseyeLayout } from "../layouts/BullseyeLayout";

export const NotFoundPage: FC = () => (
  <BullseyeLayout>
    <Typography.Title level={2}>Такой страницы нет</Typography.Title>
  </BullseyeLayout>
);
