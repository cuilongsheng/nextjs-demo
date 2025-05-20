import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Article, ArticleError } from "@/types/article";

// 获取文章详情
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // const storeCookies = await cookies();
    // const _cookies = () => Promise.resolve(storeCookies);
    // const cookieStore = await cookies();
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore as unknown as ReturnType<typeof cookies>,
    });

    const { data: article, error } = await supabase
      .from("articles")
      .select("*, author:profiles(*)")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (!article) {
      return NextResponse.json({ message: "文章不存在" } as ArticleError, {
        status: 404,
      });
    }

    return NextResponse.json(article);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "获取文章详情失败";
    return NextResponse.json({ message: errorMessage } as ArticleError, {
      status: 500,
    });
  }
}

// 更新文章
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    // 先检查文章是否存在
    const { data: existingArticle, error: checkError } = await supabase
      .from("articles")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (checkError) {
      console.error("检查文章错误:", checkError);
      throw checkError;
    }

    if (!existingArticle) {
      return NextResponse.json({ message: "文章不存在" } as ArticleError, {
        status: 404,
      });
    }

    if (existingArticle.user_id !== session.user.id) {
      return NextResponse.json(
        { message: "无权限修改此文章" } as ArticleError,
        { status: 403 }
      );
    }

    // 更新文章
    const { data: article, error: updateError } = await supabase
      .from("articles")
      .update({
        title,
        content,
        tags,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, author:profiles(*)")
      .single();

    if (updateError) {
      console.error("更新文章错误:", updateError);
      throw updateError;
    }

    if (!article) {
      return NextResponse.json({ message: "更新文章失败" } as ArticleError, {
        status: 500,
      });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("更新文章完整错误:", error);
    const errorMessage =
      error instanceof Error ? error.message : "更新文章失败";
    return NextResponse.json({ message: errorMessage } as ArticleError, {
      status: 500,
    });
  }
}

// 删除文章
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "文章已删除" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "删除文章失败";
    return NextResponse.json({ message: errorMessage } as ArticleError, {
      status: 500,
    });
  }
}
