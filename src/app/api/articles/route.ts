// app/api/articles/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { Article, ArticleError } from "@/types/article";
import { supabaseAdmin } from "@/lib/supabase";

// 获取文章列表
export async function GET(request: Request) {
  try {
    // 创建一个客户端连接，尝试使用cookies
    const cookieStore = await cookies();
    const supabaseClient = createRouteHandlerClient({
      cookies: () => cookieStore as unknown as ReturnType<typeof cookies>,
    });

    // 尝试查询文章
    const { data: articles, error } = await supabaseClient
      .from("articles")
      .select("*, author:profiles(*)")
      .order("created_at", { ascending: false });

    // 如果查询成功，直接返回结果
    if (!error) {
      return NextResponse.json(articles || []);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "获取文章列表失败";
    return NextResponse.json({ message: errorMessage } as ArticleError, {
      status: 500,
    });
  }
}

// 创建文章
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore as unknown as ReturnType<typeof cookies>,
    });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ message: "未登录" } as ArticleError, {
        status: 401,
      });
    }

    const body = await request.json();
    const { title, content, tags } = body as Article;

    if (!title || !content) {
      return NextResponse.json(
        { message: "标题和内容不能为空" } as ArticleError,
        { status: 400 }
      );
    }

    const { data: article, error } = await supabase
      .from("articles")
      .insert({
        title,
        content,
        user_id: session.user.id,
        tags,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(article);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "创建文章失败";
    return NextResponse.json({ message: errorMessage } as ArticleError, {
      status: 500,
    });
  }
}
