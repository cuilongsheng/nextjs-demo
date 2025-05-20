// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 定义需要保护的路由
const protectedRoutes = [
  "/api/articles",
  // 添加更多需要保护的路由...
];

// 定义只允许未认证用户访问的路由
const publicRoutes = [
  "/login",
  "/register",
  // 添加更多公共路由...
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 创建Supabase客户端（用于服务端会话验证）
  const supabase = createMiddlewareClient({ req, res });

  // 获取用户会话
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 检查是否访问受保护的路由
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // 检查是否访问公共路由
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  // 未认证用户访问受保护的路由
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 已认证用户访问公共路由（如登录/注册页面）
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 验证API请求的权限（示例：仅允许已认证用户访问/api/articles）
  if (req.nextUrl.pathname.startsWith("/api/articles") && !session) {
    return NextResponse.json({ error: "未认证" }, { status: 401 });
  }

  // 确保响应包含最新的会话信息
  return res;
}

// 配置中间件匹配规则
export const config = {
  matcher: [
    // 匹配所有可能需要保护的路由
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
