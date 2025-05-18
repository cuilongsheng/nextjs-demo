import { createArticle } from "@/actions/articles";

export default function NewArticle() {
  const createArt = createArticle.bind(null);
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">写文章</h1>

      <form action={createArt} className="max-w-2xl">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            标题
          </label>
          <input
            type="text"
            id="title"
            name="title"
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
            required
            rows={10}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          发布文章
        </button>
      </form>
    </main>
  );
}
