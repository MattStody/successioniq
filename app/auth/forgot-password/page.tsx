"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block mb-6">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Mercato
          </span>
        </Link>
        <h1 className="font-serif text-3xl font-bold text-slate-900 mb-2">
          Reset your password
        </h1>
        <p className="text-slate-500 text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        {sent ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl mx-auto mb-5">
              ✉️
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Check your inbox</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              We sent a password reset link to{" "}
              <strong className="text-slate-700">{email}</strong>. Follow the link to set a new password.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="text-sm text-blue-900 hover:underline"
            >
              Try a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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
              {loading ? "Sending…" : "Send Reset Link →"}
            </button>
          </form>
        )}
      </div>

      <p className="text-center text-sm text-slate-500 mt-6">
        Remember your password?{" "}
        <Link href="/auth/login" className="text-blue-900 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
