import { useState, type FC } from "react";
import { Modal, Spin, Typography, Upload } from "antd";
import { toDataURL } from "../../lib/toDataURL";

export const UpdateImageModal: FC<{
  open: boolean;
  onClose(): void;
  onSuccess(id: number | null): void;
}> = ({ open, onClose, onSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  return (
    <Modal
      open={open}
      title="Загрузить изображение"
      onOk={() => {
        onSuccess(id);
      }}
      onCancel={onClose}
    >
      <Spin spinning={uploading}>
        <Upload.Dragger
          name="file"
          multiple={false}
          showUploadList={false}
          action={new URL(
            "/upload",
            `${location.protocol}//${import.meta.env["VITE_SERVICE_ORIGIN"]}`,
          ).toString()}
          accept="image/jpg,image/png,.jpg,.png,.webp"
          onChange={async (info) => {
            switch (info.file.status) {
              case "uploading": {
                setIsError(false);
                setUploading(true);
                setId(null);

                break;
              }
              case "done": {
                setIsError(false);

                const dataURL = await toDataURL(
                  info.file.originFileObj as File,
                );

                setPreviewSrc(dataURL);

                setId(info.file.response.id);

                setUploading(false);

                break;
              }
              case "error": {
                setUploading(false);
                setIsError(true);
                setPreviewSrc(null);
                setId(null);

                break;
              }
            }
          }}
        >
          {isError ? (
            <Typography.Text type="danger">
              Произошла ошибка. Попробуйте позже
            </Typography.Text>
          ) : previewSrc ? (
            <img src={previewSrc} style={{ width: "100%" }} />
          ) : (
            <Typography.Text>Перетащите картинку сюда</Typography.Text>
          )}
        </Upload.Dragger>
      </Spin>
    </Modal>
  );
};
