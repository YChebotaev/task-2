import { type FC, type ReactNode } from "react";
import { BullseyeLayout } from "./BullseyeLayout";

export const EditorLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <BullseyeLayout>{children}</BullseyeLayout>
);
