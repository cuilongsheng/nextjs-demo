import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// 获取当前用户信息
export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { data, error } = await supabase.auth.getUser();
  console.log("user", data);
  if (error) {
    console.error("获取用户信息错误:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
