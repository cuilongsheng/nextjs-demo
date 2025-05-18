// 请求方法类型
type Method = "GET" | "POST" | "PUT" | "DELETE";

// 通用请求选项
interface RequestOptions<T = any> {
  method?: Method;
  body?: string;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean>;
  cache?: RequestCache;
}

// 通用响应类型
interface ApiResponse<T> {
  data?: T;
  error?: { message: string; status: number };
  status: number;
}

// 将非字符串值转换为字符串
const stringifyQuery = (
  query: Record<string, string | number | boolean>
): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(query).map(([key, value]) => [key, String(value)])
  );
};

// 通用fetcher函数
export const universalFetcher = async <T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> => {
  const {
    method = "GET",
    body,
    headers = {},
    query = {},
    cache = "default",
  } = options;

  // 构建完整URL（包含查询参数）
  const queryString = new URLSearchParams(stringifyQuery(query)).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  // 合并默认请求头
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };
  try {
    const response = await fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body,
      cache,
    });

    // 检查HTTP状态码
    if (!response.ok) {
      const errorData: ApiResponse<T> = await response.json().catch(() => ({
        error: {
          message: `Request failed with status ${response.status}`,
          status: response.status,
        },
        status: response.status,
      }));

      throw new Error(
        errorData.error?.message || `HTTP error! status: ${response.status}`
      );
    }

    // 解析JSON响应
    const data = await response.json().catch(() => ({}));
    return data as T;
  } catch (error) {
    console.error(`Fetcher error (${method} ${url}):`, error);
    throw error;
  }
};
