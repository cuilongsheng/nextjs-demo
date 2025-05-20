import { User } from "@supabase/supabase-js";

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

export type Article = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  author: User;
};

export type ArticleFormData = {
  title: string;
  content: string;
  tags?: string[];
};

export type ArticleComment = {
  id: string;
  content: string;
  article_id: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  author?: User;
};

export type ArticleError = {
  message: string;
  field?: string;
};
