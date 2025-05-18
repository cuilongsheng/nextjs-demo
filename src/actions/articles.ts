"use server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 获取所有文章
// export const getArticles = async () => {
const supabase = createSupabaseServerClient();
const {
  data: { session },
} = await supabase.auth.getSession();

//   const { data, error } = await supabase
//     .from("articles")
//     .select("*")
//     .eq("user_id", userId) // 添加用户ID过滤条件
//     .order("created_at", { ascending: false });
//   if (error) {
//     throw error;
//   }

//   return { data, totalCount: data.length };
// };

// 获取单篇文章
export const getArticle = async (id: string) => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// 创建文章
export const createArticle = async (formData: FormData) => {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log("session", session);
  const userId = session?.user.id; // 从会话中获取用户ID，确保session已正确初始化
  const { title, content } = Object.fromEntries(formData);
  const article = { title, content };
  const { data, error } = await supabase
    .from("articles")
    .insert([{ ...article, user_id: userId }])
    .select()
    .single();

  if (error) {
    throw error;
  }
  revalidatePath("/");
  redirect(`/`);

  return data;
};

// 更新文章
export const updateArticle = async (id: string, formData: FormData) => {
  const { title, content } = Object.fromEntries(formData);
  const article = { title, content };
  const { data, error } = await supabase
    .from("articles")
    .update(article)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  revalidatePath("/");
  redirect(`/`);
  return data;
};

// 删除文章
export const deleteArticle = async (id: string) => {
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    throw error;
  }
  revalidatePath("/");
  redirect("/");
  return true;
};
