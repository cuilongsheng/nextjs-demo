"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};
export default function Header() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Navbar className="Header-container">
      <NavbarBrand>
        <AcmeLogo />
        <p className="text-lgfont-bold text-inherit">博客系统</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        {user ? (
          <NavbarItem>
            <Button
              onPress={() => {
                if (user) {
                  router.push("/articles/new");
                } else {
                  router.push("/login");
                }
              }}
              color="primary"
              className="w-full md:w-auto mr-4"
              variant="light"
              href="/articles/new"
            >
              新建博客
            </Button>
          </NavbarItem>
        ) : null}
        <NavbarItem className="hidden lg:flex">
          {!user ? <Link href="/login">Login</Link> : null}
        </NavbarItem>
        <NavbarItem>
          <Button color="primary" isLoading={isLoading} onPress={handleSignOut}>
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
