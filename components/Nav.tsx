import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import NavAuth from "./NavAuth";
import MobileMenu from "./MobileMenu";
import CTAButton from "./CTAButton";

const NAV_LINKS = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/for-sellers", label: "Sell" },
  { href: "/for-buyers", label: "Buy" },
  { href: "/about", label: "About" },
];

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

  const dashboardHref =
    userRole === "broker"
      ? "/broker/dashboard"
      : userRole === "buyer"
      ? "/buyer/dashboard"
      : "/dashboard";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-navy">
            Succession<span className="text-accent">IQ</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-navy/70 transition-colors hover:text-navy"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/listings"
            className="text-sm font-medium text-navy/70 transition-colors hover:text-navy"
          >
            Browse Listings
          </Link>
          <NavAuth initialUser={user} firstName={firstName} userRole={userRole} />
          <CTAButton href="/valuate" className="!px-5 !py-2.5 !text-sm">
            Get My Free Valuation →
          </CTAButton>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <CTAButton href="/valuate" className="!px-3.5 !py-2 !text-xs">
            Free Valuation →
          </CTAButton>
          <MobileMenu links={NAV_LINKS} isLoggedIn={!!user} dashboardHref={dashboardHref} />
        </div>
      </div>
    </nav>
  );
}
