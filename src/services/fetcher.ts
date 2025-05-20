// 请求方法类型
// type Method = "GET" | "POST" | "PUT" | "DELETE";

// 通用请求选项
// interface RequestOptions<T> {
//   method?: Method;
//   body?: string;
//   headers?: Record<string, string>;
//   query?: Record<string, string | number | boolean>;
//   cache?: RequestCache;
// }

// 通用响应类型
// interface ApiResponse<T> {
//   data?: T;
//   error?: { message: string; status: number };
//   status: number;
// }

// 将非字符串值转换为字符串
// const stringifyQuery = (
//   query: Record<string, string | number | boolean>
// ): Record<string, string> => {
//   return Object.fromEntries(
//     Object.entries(query).map(([key, value]) => [key, String(value)])
//   );
// };

interface ApiError extends Error {
  status?: number;
}

// 通用fetcher函数
export const universalFetcher = async (url: string) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "获取数据失败";

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      const error = new Error(errorMessage) as ApiError;
      error.status = response.status;
      throw error;
    }

    return response.json();
  } catch (error) {
    console.error(`Fetcher error (${url}):`, error);
    throw error;
  }
};
