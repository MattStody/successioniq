"use client";

import { useEffect, useState, useRef } from "react";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const signOut = async () => {
    setDropdownOpen(false);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const displayName = firstName || user?.email?.split("@")[0] || "Account";
  const dashboardHref = userRole === "broker" ? "/broker/dashboard" : "/dashboard";

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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
          {displayName[0].toUpperCase()}
        </div>
        <span>{displayName}</span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
          <Link
            href={dashboardHref}
            onClick={() => setDropdownOpen(false)}
            className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href={dashboardHref}
            onClick={() => setDropdownOpen(false)}
            className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            My Listings
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setDropdownOpen(false)}
            className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Settings
          </Link>
          <div className="border-t border-slate-100 mt-1 pt-1">
            <button
              onClick={signOut}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
