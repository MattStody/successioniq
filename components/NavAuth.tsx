"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

interface NavAuthProps {
  initialUser: User | null;
  firstName: string | null;
  userRole: string | null;
}

export default function NavAuth({ initialUser, firstName, userRole }: NavAuthProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      router.refresh();
    });
    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const dashboardHref =
    userRole === "broker"
      ? "/broker/dashboard"
      : userRole === "buyer"
      ? "/buyer/dashboard"
      : "/dashboard";

  if (!user) {
    // A single quiet link — the one primary action (free valuation) lives beside it.
    return (
      <Link
        href="/auth/login"
        className="text-sm font-medium text-navy/70 transition-colors hover:text-navy"
      >
        Sign in
      </Link>
    );
  }

  // Logged in: just the avatar (no name), linking straight to the dashboard.
  const initial = (firstName || user.email || "A").charAt(0).toUpperCase();
  return (
    <Link
      href={dashboardHref}
      aria-label="Go to your dashboard"
      title="Your dashboard"
      className="w-8 h-8 rounded-full bg-blue-900 hover:bg-blue-800 text-white flex items-center justify-center text-sm font-bold transition-colors"
    >
      {initial}
    </Link>
  );
}
