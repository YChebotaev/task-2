import { type FC } from "react";
import { useParams } from "react-router";
import { Typography } from "antd";
import { NotFoundPage } from "./NotFoundPage";
import { AppLayout } from "../layouts/AppLayout";
import { Stream } from "../components/Stream";
import { usePagination } from "../hooks/usePagination";

type StreamPageParams = {
  streamSlug?: string;
};

export const StreamPage: FC<{
  defaultStreamSlug?: string;
}> = ({ defaultStreamSlug }) => {
  const { streamSlug = defaultStreamSlug } = useParams() as StreamPageParams;
  const { page, updatePage } = usePagination();

  if (!streamSlug) {
    return <NotFoundPage />;
  }

  return (
    <AppLayout>
      <Stream
        page={page}
        slug={streamSlug}
        title={(stream) => (
          <Typography.Title level={2}>{stream.title}</Typography.Title>
        )}
        onPageChange={updatePage}
      />
    </AppLayout>
  );
};
