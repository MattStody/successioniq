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

      // Read the pending role cookie set client-side before the magic link was sent
      const pendingRole = document.cookie
        .split("; ")
        .find((row) => row.startsWith("pending_role="))
        ?.split("=")[1];

      // Fetch the current profile role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      let currentRole = profile?.role ?? "seller";

      // Apply the pending role if it's a non-default role and profile is still at default.
      // The browser client is authenticated at this point so the RLS UPDATE policy fires correctly.
      if (pendingRole && pendingRole !== "seller" && currentRole === "seller") {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: pendingRole })
          .eq("id", user.id);

        if (!updateError) {
          currentRole = pendingRole;
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
