import { type FC, type ReactNode } from "react";
import { App, Button, Layout } from "antd";
import { MyMenu } from "../components/MyMenu";
import { AuthBar } from "../components/AuthBar";
import { useUser } from "../components/UserProvider";
import { useNavigate } from "react-router";

export const AppLayout: FC<{
  noContentPadding?: boolean;
  children: ReactNode;
}> = ({ noContentPadding = false, children }) => {
  const navigate = useNavigate();
  const user = useUser();
  const isAuthenticated = Boolean(user);

  return (
    <App>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout.Sider width={200}>
          <Layout.Header />
          <MyMenu />
        </Layout.Sider>
        <Layout>
          <Layout.Header
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <div style={{ flexGrow: "1" }} />
            <AuthBar />
            {isAuthenticated && (
              <Button
                type="primary"
                href="/create"
                onClick={(e) => {
                  e.preventDefault();

                  navigate("/create");
                }}
              >
                Создать пост
              </Button>
            )}
          </Layout.Header>
          <Layout.Content style={noContentPadding ? {} : { padding: "1rem" }}>
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    </App>
  );
};
