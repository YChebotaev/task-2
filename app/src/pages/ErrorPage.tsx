import { type FC } from "react";
import { Typography } from "antd";
import { BullseyeLayout } from "../layouts/BullseyeLayout";

export const ErrorPage: FC<{ message: string }> = ({ message }) => (
  <BullseyeLayout>
    <Typography.Title level={2}>{message}</Typography.Title>
  </BullseyeLayout>
);
