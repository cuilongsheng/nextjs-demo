"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Chip,
  Form,
  Input,
  Textarea,
} from "@heroui/react";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";

export default function NewArticlePage() {
  const router = useRouter();
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          tags,
          user_id: user?.id || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "创建文章失败");
      }

      router.push(`/`);
    } catch (error) {
      setError(error instanceof Error ? error : new Error("创建文章失败"));
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl  p-6 md:p-8 transition-all duration-300">
        <Breadcrumbs size="lg">
          <BreadcrumbItem>
            <Link href="/">文章列表</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>创建文章</BreadcrumbItem>
        </Breadcrumbs>
        <div className="text-2xl font-bold text-center my-10">创建文章</div>
        {error && (
          <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-400 text-red-700 dark:text-red-300 p-4 mb-6">
            <p>{error.message}</p>
          </div>
        )}

        <Form
          onSubmit={handleSubmit}
          className="w-full  flex flex-col gap-4 mt4"
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
            isRequired
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="输入标签后按回车添加分类标签"
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

          <Textarea
            isRequired
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder="请输入文章内容"
            className="w-full"
            required
            label="内容"
            labelPlacement="outside"
            size="lg"
          />

          <div className="w-full flex space-x-4 justify-end">
            <Button size="sm" onPress={() => router.push(`/`)}>
              取消
            </Button>
            <Button
              type="submit"
              size="sm"
              color="primary"
              disabled={isLoading}
              isLoading={isLoading}
            >
              发布文章
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
