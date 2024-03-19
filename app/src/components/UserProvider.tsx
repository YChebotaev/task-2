import { createContext, useContext, type FC, type ReactNode } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useApiClient } from "../hooks/useApiClient";
import { User } from "../stores/User";

const context = createContext<User | null>(null);

export const useUser = () => useContext(context)!;

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const apiClient = useApiClient();
  const { data: user } = useSuspenseQuery({
    queryKey: ["users", "me"],
    async queryFn() {
      const { data } = await apiClient.get<User | null>("/users/me");

      return data;
    },
    select(user) {
      if (user) {
        return new User(user);
      } else {
        return null;
      }
    },
  });

  return <context.Provider value={user}>{children}</context.Provider>;
};
