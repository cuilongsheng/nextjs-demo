import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 仅在客户端创建公共客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 服务端管理员客户端，仅在服务器端创建
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

// 服务器端环境中，创建管理员客户端
if (typeof window === "undefined" && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// 安全地导出supabaseAdmin
export { supabaseAdmin };
