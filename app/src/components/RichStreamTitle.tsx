import { observer } from "mobx-react-lite";
import { Space, Typography, Button } from "antd";
import { Stream as StreamStore } from "../stores/Stream";
import { useStreamSubscription } from "../hooks/useStreamSubscription";

export const RichStreamTitle = observer(
  ({
    stream,
    subscriptionType,
    title,
  }: {
    stream: StreamStore;
    subscriptionType: "tag" | "stream";
    title(stream: StreamStore): string;
  }) => {
    const { subscribe, unsubscribe } = useStreamSubscription(
      stream,
      subscriptionType,
    );

    return (
      <Space direction="horizontal" size={10}>
        <Typography.Title level={2}>{title(stream)}</Typography.Title>
        {stream.subscribed ? (
          <Button
            danger
            onClick={(e) => {
              e.preventDefault();

              unsubscribe();
            }}
          >
            Отписаться
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={(e) => {
              e.preventDefault();

              subscribe();
            }}
          >
            Подписаться
          </Button>
        )}
      </Space>
    );
  },
);
