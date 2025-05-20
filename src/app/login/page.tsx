"use client";
import { useState } from "react";
// import { supabase } from "@/lib/client";
import { useRouter } from "next/navigation";
import { Button, Form, Input } from "@heroui/react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err : new Error("登录失败"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            登录
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-400 text-red-700 dark:text-red-300 p-4 mb-6">
            <p>{error.message}</p>
          </div>
        )}

        <Form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md -space-y-px w-full">
            <div className="mb-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="邮箱"
                className="w-full"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                className="w-full"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            color="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "登录中..." : "登录"}
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            <div className="mr-2">没有账号？</div>
            <a
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              注册
            </a>
          </p>
        </Form>
      </div>
    </div>
  );
}
