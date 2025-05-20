"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Alert } from "@heroui/react";
import { Button } from "@heroui/react";
import { Loading } from "@/components/ui/Loading";
import { getArticles } from "@/services/articleService";
import { Article } from "@/types/article";
import { useUser } from "@/hooks/useUser";
import BlogCard from "@/components/BlogCard";

const ITEMS_PER_PAGE = 12;

export default function HomePage() {
  const { user } = useUser();
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchArticles = async (pageNum: number) => {
    try {
      setIsLoading(true);
      const data = await getArticles(pageNum, ITEMS_PER_PAGE);
      if (pageNum === 1) {
        setArticles(data);
      } else {
        setArticles((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === ITEMS_PER_PAGE);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("获取文章列表失败"));
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1);
  }, []);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArticles(nextPage);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto">
        <div className="max-w-8xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-end mb-8"></div>

          {error && (
            <Alert variant="flat" title="错误" className="mb-6">
              {error.message}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <BlogCard
                key={article.id}
                blog={article}
                session={user}
                onDelete={() => fetchArticles(page)}
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <Button
                onPress={handleLoadMore}
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? "加载中..." : "加载更多"}
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
