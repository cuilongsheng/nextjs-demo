// interface ApiOptions {
//   method?: "GET" | "POST" | "PUT" | "DELETE";
//   body?: any;
//   headers?: Record<string, string>;
// }

// interface ApiResponse<T> {
//   data: T;
//   error?: {
//     message: string;
//     status: number;
//   };
// }

// export class ApiError extends Error {
//   status?: number;
//   constructor(message: string, status?: number) {
//     super(message);
//     this.status = status;
//     this.name = "ApiError";
//   }
// }

// export const api = {
//   async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
//     const { method = "GET", body, headers = {} } = options;

//     const defaultHeaders = {
//       "Content-Type": "application/json",
//     };

//     try {
//       const response = await fetch(endpoint, {
//         method,
//         headers: { ...defaultHeaders, ...headers },
//         body: body ? JSON.stringify(body) : undefined,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new ApiError(data.error?.message || "请求失败", response.status);
//       }

//       return data;
//     } catch (error) {
//       if (error instanceof ApiError) {
//         throw error;
//       }
//       throw new ApiError(error instanceof Error ? error.message : "未知错误");
//     }
//   },

//   get: <T>(endpoint: string, headers?: Record<string, string>) =>
//     api.request<T>(endpoint, { method: "GET", headers }),

//   post: <T>(endpoint: string, body: any, headers?: Record<string, string>) =>
//     api.request<T>(endpoint, { method: "POST", body, headers }),

//   put: <T>(endpoint: string, body: any, headers?: Record<string, string>) =>
//     api.request<T>(endpoint, { method: "PUT", body, headers }),

//   delete: <T>(endpoint: string, headers?: Record<string, string>) =>
//     api.request<T>(endpoint, { method: "DELETE", headers }),
// };

// ApiOptions 接口改进：使用泛型约束 body 类型
interface ApiOptions<B = unknown> {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: B;
  headers?: Record<string, string>;
}

// 标准 API 响应结构
interface ApiResponse<T> {
  data: T;
  error?: {
    message: string;
    status: number;
  };
}

// 自定义 API 错误类
export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// API 客户端类（使用类结构增强可扩展性）
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // 核心请求方法
  async request<T, B = unknown>(
    endpoint: string,
    options: ApiOptions<B> = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    try {
      const fullUrl = `${this.baseUrl}${endpoint}`;
      const response = await fetch(fullUrl, {
        method,
        headers: { ...defaultHeaders, ...headers },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      // 处理可能的空响应（如 204 No Content）
      const data = response.status === 204 ? null : await response.json();

      if (!response.ok) {
        throw new ApiError(
          (data as ApiResponse<unknown>)?.error?.message || "请求失败",
          response.status
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(error instanceof Error ? error.message : "未知错误");
    }
  }

  // HTTP 方法快捷方式
  get<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: "GET", headers });
  }

  post<T, B = unknown>(
    endpoint: string,
    body: B,
    headers?: Record<string, string>
  ) {
    return this.request<T, B>(endpoint, { method: "POST", body, headers });
  }

  put<T, B = unknown>(
    endpoint: string,
    body: B,
    headers?: Record<string, string>
  ) {
    return this.request<T, B>(endpoint, { method: "PUT", body, headers });
  }

  delete<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: "DELETE", headers });
  }
}

// 创建 API 客户端实例
export const api = new ApiClient("http://localhost:3000/api");
