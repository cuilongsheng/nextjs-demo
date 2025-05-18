// app/api/articles/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    // 2. 获取会话
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("Supabase 会话:", session);

    if (!session) {
      return NextResponse.json({ error: "未认证" }, { status: 401 });
    }

    // 3. 查询文章
    const userId = session.user.id;
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("查询错误:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("意外错误:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
