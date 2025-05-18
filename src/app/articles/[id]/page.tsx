import Link from "next/link";
import { getArticle } from "@/actions/articles";
import { formatTimestamp } from "@/utils/tools";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);
  // const deleteByID = deleteArticle.bind(null, id);

  if (!article) {
    return <div>文章不存在</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{article.title}</h1>
          <div className="space-x-4">
            <Link
              href={`/articles/${id}/edit`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              编辑
            </Link>
            {/* <form action={deleteByID} className="inline">
              <button
                type="submit"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                删除
              </button>
            </form> */}
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            {formatTimestamp(article.created_at)}
          </p>
          <div className="whitespace-pre-wrap">{article.content}</div>
        </div>
      </div>
    </main>
  );
}
