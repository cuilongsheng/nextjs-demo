import { getArticle, updateArticle } from "@/actions/articles";

export default async function EditArticle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);

  const updateByID = updateArticle.bind(null, id); // 官方文档推荐用法 相当于这样传递参数: updateArticle(id, formData)

  if (!article) {
    return <div>文章不存在</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">编辑文章</h1>
      <form action={updateByID} className="max-w-2xl">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            标题
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={article.title}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            内容
          </label>
          <textarea
            id="content"
            name="content"
            defaultValue={article.content}
            required
            rows={10}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          更新文章
        </button>
      </form>
    </main>
  );
}
