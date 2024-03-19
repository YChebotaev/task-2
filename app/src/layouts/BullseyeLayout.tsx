import { type FC, type ReactNode } from "react";

export const BullseyeLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minWidth: "100vw",
      minHeight: "100vh",
    }}
  >
    {children}
  </div>
);
