import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ArticleError } from "@/types/article";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id, commentId } = await params;
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
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("article_id", id)
      .eq("author_id", session.user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "评论已删除" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "删除评论失败";
    return NextResponse.json({ message: errorMessage } as ArticleError, {
      status: 500,
    });
  }
}
