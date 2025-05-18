// lib/supabase-server.js
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const createSupabaseServerClient = () => {
  return createServerComponentClient({ cookies });
};
