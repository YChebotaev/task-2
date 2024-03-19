import { useState, type FC } from "react";
import { Button } from "antd";
import { UpdateImageModal } from "./UpdateImageModal";
import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "../../hooks/useApiClient";

export const UpdateImageButton: FC<{
  type: "cover" | "avatar";
  children: string;
  onChange(): void;
}> = ({ type, children, onChange }) => {
  const apiClient = useApiClient();
  const [isShowModal, setIsShowModal] = useState(false);
  const { mutate } = useMutation({
    async mutationFn({ id }: { id: number }) {
      const { data } = await apiClient.post(`/users/me/${type}`, { id });

      return data;
    },
    onSuccess() {
      onChange();
    },
  });

  return (
    <div>
      <Button
        onClick={(e) => {
          e.preventDefault();

          setIsShowModal(true);
        }}
      >
        {children}
      </Button>
      <UpdateImageModal
        open={isShowModal}
        onClose={() => setIsShowModal(false)}
        onSuccess={(id) => {
          if (id != null) {
            mutate({ id });
          }

          setIsShowModal(false);
        }}
      />
    </div>
  );
};
