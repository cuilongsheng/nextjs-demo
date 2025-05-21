const API_URL = "/api";

export async function getArticles(page = 1, limit = 20) {
  try {
    console.log(`正在获取文章列表，页码: ${page}, 每页数量: ${limit}`);
    const response = await fetch(`/api/articles?page=${page}&limit=${limit}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`获取文章列表失败 (${response.status}): ${errorText}`);
      throw new Error(`获取文章列表失败: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`获取文章成功, 数量: ${data?.length || 0}`);
    return data || [];
  } catch (error) {
    console.error("获取文章列表出错:", error);
    throw error;
  }
}

export async function getArticle(id: string) {
  const response = await fetch(`${API_URL}/articles/${id}`);
  if (!response.ok) {
    throw new Error("获取文章详情失败");
  }
  return response.json();
}

export async function createArticle(article: {
  title: string;
  content: string;
  tags?: string[];
  user_id: string;
}) {
  const response = await fetch(`${API_URL}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(article),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "创建文章失败");
  }
  return response.json();
}

export async function updateArticle(
  id: string,
  article: {
    title: string;
    content: string;
    tags?: string[];
    user_id: string;
  }
) {
  const response = await fetch(`${API_URL}/articles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(article),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "更新文章失败");
  }
  return response.json();
}

export async function deleteArticle(id: string) {
  const response = await fetch(`${API_URL}/articles/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("删除文章失败");
  }
  return response.json();
}

export async function getComments(articleId: string) {
  const response = await fetch(`${API_URL}/articles/${articleId}/comments`);
  if (!response.ok) {
    throw new Error("获取评论失败");
  }
  return response.json();
}

export async function createComment(articleId: string, content: string) {
  const response = await fetch(`${API_URL}/articles/${articleId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error("创建评论失败");
  }
  return response.json();
}
