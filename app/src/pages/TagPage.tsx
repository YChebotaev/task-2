import { type FC } from "react";
import { useParams } from "react-router";
import { usePagination } from "../hooks/usePagination";
import { AppLayout } from "../layouts/AppLayout";
import { Stream } from "../components/Stream";
import { RichStreamTitle } from "../components/RichStreamTitle";
import { useUser } from "../components/UserProvider";
import { Typography } from "antd";

type TagPageParams = {
  tagSlug: string;
};

export const TagPage: FC = () => {
  const { tagSlug } = useParams() as TagPageParams;
  const { page, updatePage } = usePagination();
  const isAuthenticated = Boolean(useUser());

  return (
    <AppLayout>
      <Stream
        page={page}
        slug={tagSlug}
        onPageChange={updatePage}
        title={(stream) =>
          isAuthenticated ? (
            <RichStreamTitle
              subscriptionType="tag"
              title={() => `Посты по тегу «${stream.title}»`}
              stream={stream}
            />
          ) : (
            <Typography.Title level={2}>
              Посты по тегу «{stream.title}»
            </Typography.Title>
          )
        }
      />
    </AppLayout>
  );
};
