import useSWR from "swr";
import { universalFetcher } from "./fetcher";
import { Article } from "@/types/article";

// 获取所有文章
export const useArticles = () => {
  return useSWR<Article[]>("/api/articles", universalFetcher, {
    revalidateOnFocus: false,
  });
};

// 获取单篇文章
export const useArticle = (id: string | null) => {
  return useSWR<Article>(id ? `/api/articles/${id}` : null, universalFetcher);
};
