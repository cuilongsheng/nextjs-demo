"use client";
import { Article } from "@/types/article";
import { User } from "@supabase/supabase-js";
import { Button, Chip } from "@heroui/react";
import { useRouter } from "next/navigation";
import { CardBody, Card, CardFooter, CardHeader } from "@heroui/react";
import { deleteArticle } from "@/services/articleService";
import DeleteButton from "./ui/DeleteButton";

interface BlogCardProps {
  blog: Article;
  session: User | null;
  onDelete: () => void;
}

export default function BlogCard({ blog, session, onDelete }: BlogCardProps) {
  const router = useRouter();
  const handleDelete = async () => {
    await deleteArticle(blog.id);
    onDelete();
  };

  const handleClick = () => {
    router.push(`/articles/${blog.id}`);
  };

  // 截断长文本
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div
      className="cursor-pointer transition-all duration-300 hover:translate-y-[-4px]"
      onClick={handleClick}
    >
      <Card className="w-full border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md overflow-hidden">
        <CardHeader className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-1">
            {blog.title}
          </h3>
        </CardHeader>
        <CardBody className="p-4">
          <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3 text-sm min-h-[60px]">
            {truncateText(blog.content, 150)}
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {blog.tags?.map((tag) => (
              <Chip
                key={tag}
                color="secondary"
                variant="flat"
                size="sm"
                className="text-xs"
              >
                {tag}
              </Chip>
            ))}
          </div>
        </CardBody>
        <CardFooter className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(blog.created_at).toLocaleDateString()}
          </div>
          {session?.id === blog.author.id && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="light"
                onPress={() => {
                  // 阻止事件冒泡，避免触发卡片点击事件
                  setTimeout(() => {
                    router.push(`/articles/${blog.id}/edit`);
                  }, 0);
                }}
                className="px-2 py-0 min-w-5"
              >
                编辑
              </Button>
              <DeleteButton
                variant="light"
                title="删除文章"
                description="确定要删除这篇文章吗？"
                onDelete={handleDelete}
                className="px-2 py-0 min-w-5"
              />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
