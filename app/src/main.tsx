import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocketIOProvider } from "./components/SocketIOProvider";
import { SignupPage } from "./pages/SingupPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ApiClientProvider } from "./hooks/useApiClient";
import { SigninPage } from "./pages/SinginPage";
import { StreamPage } from "./pages/StreamPage";
import { UserPage } from "./pages/UserPage";
import { TagPage } from "./pages/TagPage";
import { UserProvider } from "./components/UserProvider";
import { CreatePage } from "./pages/CreatePage";
import { PostCommentsPage } from "./pages/PostCommentsPage";
import { DirectMessagesPage } from "./pages/DirectMessagesPage";
import "./global.css";

const apiClient = axios.create({
  baseURL: `${location.protocol}//${import.meta.env["VITE_SERVICE_ORIGIN"]!}`,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/auth/signup",
    element: <SignupPage />,
  },
  {
    path: "/auth/signin",
    element: <SigninPage />,
  },
  {
    path: "/create",
    element: <CreatePage />,
  },
  {
    path: "/",
    element: <StreamPage defaultStreamSlug="everything" />,
  },
  {
    path: "/:streamSlug?",
    element: <StreamPage />,
  },
  {
    path: "/u/:username",
    element: <UserPage />,
  },
  {
    path: "/t/:tagSlug",
    element: <TagPage />,
  },
  {
    path: "/p/:postId",
    element: <PostCommentsPage />,
  },
  {
    path: "/dm/:userId",
    element: <DirectMessagesPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApiClientProvider apiClient={apiClient}>
      <SocketIOProvider>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider locale={ruRU}>
            <UserProvider>
              <Suspense fallback={null}>
                <RouterProvider router={router} />
              </Suspense>
            </UserProvider>
          </ConfigProvider>
        </QueryClientProvider>
      </SocketIOProvider>
    </ApiClientProvider>
  </React.StrictMode>,
);
