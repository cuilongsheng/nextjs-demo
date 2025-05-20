import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ArticleComment, ArticleError } from "@/types/article";

// 获取评论列表
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore as unknown as ReturnType<typeof cookies>,
    });

    const { data: comments, error } = await supabase
      .from("comments")
      .select("*, author:profiles(*)")
      .eq("article_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(comments);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "获取评论失败";
    return NextResponse.json({ message: errorMessage } as ArticleError, {
      status: 500,
    });
  }
}

// 创建评论
export async function POST(
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

    const body = await request.json();
    const { content } = body as ArticleComment;

    if (!content) {
      return NextResponse.json(
        { message: "评论内容不能为空" } as ArticleError,
        { status: 400 }
      );
    }

    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        content,
        article_id: id,
        user_id: session.user.id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(comment);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "创建评论失败";
    return NextResponse.json({ message: errorMessage } as ArticleError, {
      status: 500,
    });
  }
}
