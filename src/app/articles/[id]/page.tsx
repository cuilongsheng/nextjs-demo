"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Article, ArticleComment } from "@/types/article";
import { User } from "@supabase/supabase-js";
import { Alert } from "@/components/ui/Alert";
import { Loading } from "@/components/ui/Loading";
import { BreadcrumbItem, Breadcrumbs, Button, Chip } from "@heroui/react";
import { Form, Spinner, Textarea } from "@heroui/react";
import Link from "next/link";
import { use } from "react";
import DeleteButton from "@/components/ui/DeleteButton";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${id}`);
        if (!response.ok) {
          throw new Error("获取文章失败");
        }
        const data = await response.json();
        setArticle(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "获取文章失败");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/articles/${id}/comments`);
        if (!response.ok) {
          throw new Error("获取评论失败");
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("获取评论失败:", error);
      }
    };

    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchArticle();
    fetchComments();
    getUser();
  }, [id, supabase.auth]);

  const handleDelete = async () => {
    if (!confirm("确定要删除这篇文章吗？")) {
      return;
    }

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("删除文章失败");
      }

      router.push("/");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "删除文章失败");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/articles/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "提交评论失败");
      }

      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "提交评论失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="error" title="错误">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto edit-article py-10">
      <div className="flex justify-between items-center">
        <Breadcrumbs size="lg">
          <BreadcrumbItem>
            <Link href="/">文章列表</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>文章详情</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex items-center mb-4">
          {user?.id === article.user_id && (
            <div className="ml-auto flex space-x-2">
              <Button
                size="sm"
                onPress={() => {
                  router.push(`/articles/${article.id}/edit`);
                }}
              >
                编辑
              </Button>
              <DeleteButton
                title="删除文章"
                description="确定要删除这篇文章吗？"
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>
      </div>
      {article ? (
        <>
          <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 mt-6 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {article.title}
            </h1>
            <div className="mb-6 flex flex-wrap gap-2">
              {article.tags?.map((tag: string) => (
                <Chip color="secondary" key={tag} variant="flat">
                  {tag}
                </Chip>
              ))}
            </div>
            <div className="prose max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 border-t border-b border-gray-200 dark:border-gray-700 py-6 my-4">
              {article.content}
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 text-right mt-4">
              发布于: {new Date(article.created_at).toLocaleDateString()}
            </div>
          </article>

          <div className="rounded-xl mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 shadow-sm">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
              评论
            </h4>

            {user ? (
              <Form onSubmit={handleSubmitComment} className="mb-8">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  placeholder="请输入评论"
                  className="w-full rounded-none"
                />
                <div className="w-full flex justify-end">
                  <Button
                    type="submit"
                    color="primary"
                    className="mt-2"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    size="sm"
                  >
                    发表评论
                  </Button>
                </div>
              </Form>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                请{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  登录
                </a>{" "}
                评论
              </p>
            )}

            {comments.length > 0 ? (
              <div className="space-y-2">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-100 dark:bg-gray-700 p-4 flex items-start justify-center flex-col rounded-small"
                  >
                    <div className="text-gray-700 dark:text-gray-300 text-sm font-bold">
                      {comment.content}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-small text-center mb-4">
                暂无评论
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-64">
          <Spinner className="animate-spin h-10 w-10 text-blue-500" />
        </div>
      )}
    </div>
  );
}
