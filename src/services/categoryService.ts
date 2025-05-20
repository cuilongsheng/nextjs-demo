import { Category } from "@/types/article";

// 获取所有分类
export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("获取分类失败");
  }
  return response.json();
};

// 获取单个分类
export const getCategory = async (id: string): Promise<Category> => {
  const response = await fetch(`/api/categories/${id}`);
  if (!response.ok) {
    throw new Error("获取分类详情失败");
  }
  return response.json();
};

// 创建分类
export const createCategory = async (
  name: string,
  description?: string
): Promise<Category> => {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description }),
  });
  if (!response.ok) {
    throw new Error("创建分类失败");
  }
  return response.json();
};

// 更新分类
export const updateCategory = async (
  id: string,
  name: string,
  description?: string
): Promise<Category> => {
  const response = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description }),
  });
  if (!response.ok) {
    throw new Error("更新分类失败");
  }
  return response.json();
};

// 删除分类
export const deleteCategory = async (id: string): Promise<void> => {
  const response = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("删除分类失败");
  }
};
