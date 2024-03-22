import { type FC } from "react";
import { Root, Label, Value } from "./styled";

export const Field: FC<{ label: string; children: string }> = ({
  label,
  children,
}) => (
  <Root>
    <Label>{label}</Label>
    <Value>{children}</Value>
  </Root>
);
