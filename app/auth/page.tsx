"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Suspense } from "react";
import type { UserRole } from "@/lib/types";

const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: "seller", label: "Seller", description: "I want to sell my business" },
  { value: "buyer", label: "Buyer", description: "I'm looking to acquire" },
  { value: "broker", label: "Broker", description: "I represent sellers" },
];

function AuthForm() {
  const searchParams = useSearchParams();
  const hasError = searchParams.get("error") === "true";

  const [role, setRole] = useState<UserRole>("seller");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(
    hasError ? "The sign-in link was invalid or expired. Please try again." : null
  );

  const supabase = createSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Store selected role in a cookie so the callback can read it reliably.
    // This survives the full magic link round-trip on the same device/browser.
    document.cookie = `pending_role=${role}; path=/; max-age=3600; SameSite=Lax`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-700" />
          No password required
        </div>
        <h1 className="font-serif text-4xl font-bold text-slate-900 mb-3">
          Sign in to SuccessionIQ
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Enter your email and we&apos;ll send you a magic link. No password needed.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        {sent ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl mx-auto mb-5">
              ✉️
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Check your inbox
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              We sent a magic link to{" "}
              <strong className="text-slate-700">{email}</strong>. Click it to
              sign in — it expires in 1 hour.
            </p>
            {role === "broker" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 text-xs text-blue-800 text-left">
                Your account will be set up as a <strong>Broker</strong>. You&apos;ll
                have access to bulk listing tools and a broker dashboard.
              </div>
            )}
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="text-sm text-blue-900 hover:underline"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                I am a…
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      role === r.value
                        ? "bg-blue-900 text-white border-blue-900 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {ROLES.find((r) => r.value === role)?.description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-semibold transition-all text-sm shadow-md hover:shadow-lg"
            >
              {loading ? "Sending…" : "Send magic link →"}
            </button>

            <p className="text-center text-xs text-slate-400">
              By signing in you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-slate-400 text-sm">Loading…</div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
