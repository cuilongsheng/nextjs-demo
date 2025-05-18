// export const revalidate = 0; 基于时间的从新验证 0是时间, 默认是60秒,每隔60秒重新验证一次, ISR
// export const dynamic = "force-dynamic";
// 禁用缓存,动态渲染
import Link from "next/link";
import ArticleList from "./clientComponents/list";

export default async function Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">博客列表</h1>
        <Link
          href="/articles/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          写文章
        </Link>
      </div>
      <ArticleList />
    </main>
  );
}
