"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { consumePendingListingUrl, GATE_EMAIL_KEY } from "@/lib/post-auth";
import type { UserRole } from "@/lib/types";

// Broker is intentionally not self-selectable — that role is provisioned
// server-side (see migration 014). Sellers and buyers self-onboard here.
const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: "seller", label: "Seller", description: "I want to sell my business" },
  { value: "buyer", label: "Buyer", description: "I'm looking to acquire" },
];

export default function SignUpPage() {
  const [role, setRole] = useState<UserRole>("seller");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  // Carry the email entered at the valuation gate so Bob doesn't retype it.
  useEffect(() => {
    const gateEmail = window.localStorage.getItem(GATE_EMAIL_KEY);
    if (gateEmail) setEmail(gateEmail);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, full_name: fullName },
        // Route the confirmation link through the callback, which restores the
        // pending listing the user was creating.
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
      },
    });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already in use") || msg.includes("already exists")) {
        setError("An account with this email already exists. Try signing in instead.");
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
      return;
    }

    if (!data.session) {
      // Email confirmation required — Supabase trigger creates the profile row.
      // full_name will be updated on first login via user_metadata.
      setEmailSent(true);
      setLoading(false);
      return;
    }

    // Trigger defaults role to 'seller' — immediately override with the selected role
    if (data.user) {
      await supabase
        .from("profiles")
        .update({ role, full_name: fullName })
        .eq("id", data.user.id);
    }

    // If they came from a valuation, drop them back into the prefilled listing.
    const pending = consumePendingListingUrl();
    router.replace(pending ?? (role === "broker" ? "/broker/dashboard" : "/dashboard"));
  };

  if (emailSent) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Mercato
            </span>
          </Link>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl mx-auto mb-5">
            ✉️
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Check your inbox</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            We sent a confirmation link to{" "}
            <strong className="text-slate-700">{email}</strong>. Click it to activate your account.
          </p>
          <button
            onClick={() => { setEmailSent(false); setEmail(""); setPassword(""); setConfirmPassword(""); }}
            className="text-sm text-blue-900 hover:underline"
          >
            Use a different email
          </button>
        </div>
        <p className="text-center text-sm text-slate-500 mt-6">
          Already confirmed?{" "}
          <Link href="/auth/login" className="text-blue-900 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block mb-6">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Mercato
          </span>
        </Link>
        <h1 className="font-serif text-3xl font-bold text-slate-900 mb-2">
          Create your account
        </h1>
        <p className="text-slate-500 text-sm">
          Join Mercato to buy, sell, or broker businesses.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              I am a…
            </label>
            <div className="grid grid-cols-2 gap-2">
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

          {/* Full name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              required
              placeholder="Jane Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors text-sm"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors text-sm"
            />
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Confirm password
            </label>
            <input
              type="password"
              required
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-semibold transition-all text-sm shadow-md hover:shadow-lg"
          >
            {loading ? "Creating account…" : "Create Account →"}
          </button>

          <p className="text-center text-xs text-slate-400">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-900 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
