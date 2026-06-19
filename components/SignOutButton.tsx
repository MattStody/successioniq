"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  return (
    <button
      type="button"
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
      }}
      className="text-sm font-medium text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 px-4 py-2 rounded-lg transition-colors"
    >
      Sign out
    </button>
  );
}
