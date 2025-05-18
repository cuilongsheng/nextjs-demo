import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log("session 哈哈哈", session);

  // 如果用户未登录且访问受保护的路由，重定向到登录页面
  if (!session && req.nextUrl.pathname.startsWith("/articles")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 如果用户已登录且访问登录/注册页面，重定向到仪表板
  if (
    session &&
    (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/articles", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/articles/:path*", "/login", "/register", "/api/:path*"],
};
