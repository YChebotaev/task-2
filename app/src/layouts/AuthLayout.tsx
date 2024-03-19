import { type FC, type ReactNode } from "react";
import { BullseyeLayout } from "./BullseyeLayout";

export const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <BullseyeLayout>{children}</BullseyeLayout>
);
