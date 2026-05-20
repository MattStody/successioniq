"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const handle = async () => {
      const code = searchParams.get("code");
      if (!code) {
        router.replace("/auth/login");
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        router.replace("/auth/login");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      // Sync full_name from user_metadata into profile if not set yet
      const metaName = user.user_metadata?.full_name as string | undefined;
      if (metaName) {
        await supabase
          .from("profiles")
          .update({ full_name: metaName })
          .eq("id", user.id)
          .is("full_name", null);
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      router.replace(profile?.role === "broker" ? "/broker/dashboard" : "/dashboard");
    };

    handle();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-slate-400 text-sm">Loading…</p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
