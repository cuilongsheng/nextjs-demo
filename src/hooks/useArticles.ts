import useSWR from "swr";
import { universalFetcher } from "@/services/fetcher";
import { Article } from "@/types/article";

export function useArticles() {
  const { data, error, isLoading, mutate } = useSWR<Article[]>(
    "/api/articles",
    universalFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 0,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      onError: (err) => {
        console.error("获取文章列表失败:", err);
      },
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
