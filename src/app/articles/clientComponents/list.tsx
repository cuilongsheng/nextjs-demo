"use client";

import { useArticles } from "@/services/articleService";
import { formatTimestamp } from "@/utils/tools";
import Link from "next/link";

export default function ArticleList() {
  const { data, isLoading, error } = useArticles();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div className="grid gap-6">
      {data?.map((article) => (
        <article key={article.id} className="border p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">
            <Link
              href={`/articles/${article.id}`}
              className="hover:text-blue-500"
            >
              {article.title}
            </Link>
          </h2>
          <p className="text-gray-600 mb-4">
            {article.content.substring(0, 200)}...
          </p>
          <div className="text-sm text-gray-500">
            {formatTimestamp(article.created_at)}
          </div>
        </article>
      ))}
    </div>
  );
}
