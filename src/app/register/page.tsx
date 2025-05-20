"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button, Form, Input } from "@heroui/react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !username) {
      setError("邮箱、密码和用户名都是必填项");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. 注册用户
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // 2. 创建用户资料
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          username: username,
          avatar_url: null,
        });

        if (profileError) {
          throw profileError;
        }
      }

      router.push("/login");
    } catch (error: unknown) {
      console.error("注册错误:", error);
      setError(error instanceof Error ? error.message : "注册失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            创建账号
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-400 text-red-700 dark:text-red-300 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        <Form onSubmit={handleRegister} className="mt-8 space-y-6">
          <div className="rounded-md w-full space-y-px">
            <div className="mb-4">
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="用户名"
                className="w-full"
                required
              />
            </div>
            <div className="mb-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="邮箱地址"
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
            disabled={loading}
          >
            {loading ? "注册中..." : "创建账号"}
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            <div className="mr-2">已有账号？</div>
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              登录
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
