import { useState, useCallback } from "react";
import { api, ApiError } from "@/utils/api";

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async <R>(request: () => Promise<R>, options: UseApiOptions<R> = {}) => {
      const { onSuccess, onError } = options;
      setIsLoading(true);
      setError(null);

      try {
        const result = await request();
        setData(result as unknown as T);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof ApiError ? err : new ApiError("未知错误");
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    data,
    error,
    isLoading,
    execute,
  };
}

export function useApiMutation<T, V>() {
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(
    async (endpoint: string, variables: V, options: UseApiOptions<T> = {}) => {
      const { onSuccess, onError } = options;
      setIsLoading(true);
      setError(null);

      try {
        const result = await api.post<T>(endpoint, variables);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof ApiError ? err : new ApiError("未知错误");
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    error,
    isLoading,
    mutate,
  };
}
