"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Suspense } from "react";

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const handle = async () => {
      const code = searchParams.get("code");
      if (!code) {
        router.replace("/auth?error=true");
        return;
      }

      // Exchange the code for a session using the browser client.
      // The browser client has the PKCE code verifier in localStorage/cookies
      // and correctly sets the session after exchange.
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        router.replace("/auth?error=true");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth?error=true");
        return;
      }

      // Primary source: role stored in user_metadata via signInWithOtp options.data.
      // This is written into raw_user_meta_data by Supabase at OTP-send time and
      // survives cross-device/browser usage (unlike a cookie).
      const metadataRole = user.user_metadata?.role as string | undefined;

      // Fallback: cookie set on the same device before the magic link was sent.
      const cookieRole = document.cookie
        .split("; ")
        .find((row) => row.startsWith("pending_role="))
        ?.split("=")[1];

      const desiredRole = metadataRole || cookieRole;

      // Fetch the current profile role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      let currentRole = profile?.role ?? "seller";

      // Upgrade role if the user signed up as broker/buyer but their profile
      // still shows the default 'seller' (the trigger may not have had the metadata yet).
      if (desiredRole && desiredRole !== "seller" && currentRole === "seller") {
        const { data: updated } = await supabase
          .from("profiles")
          .update({ role: desiredRole })
          .eq("id", user.id)
          .select("role")
          .single();

        if (updated?.role) {
          currentRole = updated.role;
        }
      }

      // Clear the pending_role cookie
      document.cookie = "pending_role=; path=/; max-age=0";

      // Redirect based on resolved role
      if (currentRole === "broker") {
        router.replace("/broker/dashboard");
      } else {
        router.replace("/dashboard");
      }
    };

    handle();
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center gap-1.5 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-blue-900 animate-bounce"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>
        <p className="text-slate-400 text-sm">Signing you in…</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading…</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
