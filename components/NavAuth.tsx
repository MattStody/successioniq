"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

export default function NavAuth({ initialUser }: { initialUser: User | null }) {
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

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (!user) {
    return (
      <Link
        href="/auth"
        className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/dashboard"
        className="text-slate-500 hover:text-slate-900 transition-colors text-sm"
      >
        Dashboard
      </Link>
      <span className="text-slate-300 text-xs hidden lg:block">
        {user.email}
      </span>
      <button
        onClick={signOut}
        className="text-sm text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
