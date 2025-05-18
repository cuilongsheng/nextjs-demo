"use client";
import { GetServerSideProps } from "next";
import { createServerClient } from "@supabase/ssr";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@heroui/react";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    props: {
      session: session as { user: User } | null, // 传递到客户端
    },
  };
};

export default function Home({ session }: { session: { user: User } | null }) {
  const { data: clientSession } = useSession();
  const user = clientSession?.user || session?.user;

  return (
    <div className="container mx-auto px-4 py-8">
      {user ? (
        <Button
          onPress={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          退出登录
        </Button>
      ) : (
        <Button
          href="/login"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          登录
        </Button>
      )}
    </div>
  );
}
