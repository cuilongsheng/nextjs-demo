import { User } from "@supabase/supabase-js";

export type ApiError = {
  message: string;
  status?: number;
};

export type ApiResponse<T> = {
  data: T;
  error: ApiError | null;
};

export type UserSession = {
  user: User | null;
  isLoading: boolean;
};

export type EditorRef = {
  getValue: () => string;
  setValue: (value: string) => void;
  focus: () => void;
};
