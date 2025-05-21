"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { CodeEditor } from "@/components/ui/CodeEditor";
import { getArticle, updateArticle } from "@/services/articleService";
import { Article } from "@/types/article";
import { useUser } from "@/hooks/useUser";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Chip,
  Form,
  Input,
  Spinner,
} from "@heroui/react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticle(id);
        setArticle(data);
        setTitle(data.title);
        setContent(data.content);
        setTags(data.tags || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("获取文章失败"));
      }
    };

    fetchArticle();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;

    try {
      setIsLoading(true);
      await updateArticle(article.id, {
        title,
        content,
        tags,
        user_id: user?.id || "",
      });
      router.push(`/articles/${article.id}`);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("更新文章失败"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {article ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl  p-6 md:p-8 transition-all duration-300">
          <Breadcrumbs size="lg">
            <BreadcrumbItem>
              <Link href="/">文章列表</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>编辑文章</BreadcrumbItem>
          </Breadcrumbs>

          {error && (
            <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-400 text-red-700 dark:text-red-300 p-4 mb-6">
              <p>{error.message}</p>
            </div>
          )}

          <Form
            onSubmit={handleSubmit}
            className="w-full  flex flex-col gap-4 mt-7"
          >
            <Input
              isRequired
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入文章标题"
              className="w-full text-lg"
              required
              label="标题"
              labelPlacement="outside"
              size="lg"
            />

            <Input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="输入标签后按回车添加"
              className="w-full"
              label="标签"
              labelPlacement="outside"
              size="lg"
            />
            <div className="flex flex-wrap gap-2 mb-2">
              {tags?.map((tag) => (
                <Chip
                  color="secondary"
                  key={tag}
                  variant="solid"
                  onClose={() => handleRemoveTag(tag)}
                >
                  {tag}
                </Chip>
              ))}
            </div>

            <CodeEditor
              value={content}
              onChange={(value) => setContent(value)}
              height="300px"
              label="内容"
              className="w-full"
              language="markdown"
            />

            <div className="w-full flex space-x-4 justify-end">
              <Button size="sm" onPress={() => router.push(`/${id}`)}>
                取消
              </Button>
              <Button
                type="submit"
                size="sm"
                color="primary"
                disabled={isLoading}
                isLoading={isLoading}
              >
                更新文章
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <Spinner className="animate-spin h-10 w-10 text-blue-500" />
        </div>
      )}
    </div>
  );
}
