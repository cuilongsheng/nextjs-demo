export type User = {
  id?: string | number;
  email: string;
  password: string;
  created_at?: string;
  updated_at?: string;
  avatar?: string;
  name?: string;
  role?: string;
  status?: string;
  is_admin?: boolean;
  is_active?: boolean;
  username?: string;
};
