import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import NavAuth from "./NavAuth";

export default async function Nav() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let firstName: string | null = null;
  let userRole: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();

    firstName = profile?.full_name?.split(" ")[0] ?? null;
    userRole = profile?.role ?? null;
  }

  return (
    <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Succession
            <span className="text-blue-900">IQ</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
          <Link href="/listings" className="hover:text-slate-900 transition-colors">
            Browse Listings
          </Link>
          <Link href="/valuate" className="hover:text-slate-900 transition-colors">
            Valuate
          </Link>
          <NavAuth initialUser={user} firstName={firstName} userRole={userRole} />
        </div>
      </div>
    </nav>
  );
}
