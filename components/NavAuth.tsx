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
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
        >
          Sign In
        </Link>
        <Link
          href="/auth/signup"
          className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          Get Started
        </Link>
      </div>
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
