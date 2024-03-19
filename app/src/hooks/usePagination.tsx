import { useSearchParams } from "react-router-dom";

export const usePagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.has("page") ? Number(searchParams.get("page")) : 0;

  return {
    page,
    updatePage(page: number) {
      setSearchParams({ page: String(page) });
    },
  };
};
