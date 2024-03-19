import { createContext, useContext, type FC, type ReactNode } from "react";
import { type AxiosInstance } from "axios";

const context = createContext<AxiosInstance | null>(null);

export const useApiClient = () => useContext(context)!;

export const ApiClientProvider: FC<{
  apiClient: AxiosInstance;
  children: ReactNode;
}> = ({ apiClient, children }) => (
  <context.Provider value={apiClient}>{children}</context.Provider>
);
