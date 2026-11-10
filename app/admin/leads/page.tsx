import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import ExportButton from "./ExportButton";

export const metadata: Metadata = {
  title: "Leads — FairMark Admin",
  robots: { index: false, follow: false },
};

// Only this address may view captured leads. The RLS policy on email_leads
// enforces the same rule at the database level, so even if this check were
// bypassed the query would return nothing for anyone else.
const ADMIN_EMAIL = "matt@boldlymedia.com";

type Lead = {
  id: string;
  created_at: string;
  email: string;
  source: string | null;
  industry: string | null;
  country: string | null;
  region: string | null;
};

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function locationLabel(l: Lead): string {
  const parts = [l.region, l.country].filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
}

const DAY_MS = 24 * 60 * 60 * 1000;

// Kept out of the component body so the render stays free of impure `Date.now`.
function countWithinDays(leads: Lead[], days: number): number {
  const cutoff = Date.now() - days * DAY_MS;
  return leads.filter((l) => new Date(l.created_at).getTime() >= cutoff).length;
}

export default async function AdminLeadsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");
  if (!user.email || user.email.toLowerCase() !== ADMIN_EMAIL) notFound();

  const { data, error } = await supabase
    .from("email_leads")
    .select("id, created_at, email, source, industry, country, region")
    .order("created_at", { ascending: false });

  const leads: Lead[] = (data as Lead[] | null) ?? [];

  const stats = [
    { label: "Total leads", value: leads.length },
    { label: "Last 7 days", value: countWithinDays(leads, 7) },
    { label: "Last 30 days", value: countWithinDays(leads, 30) },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FC] text-[#0E1330]">
      <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-[-0.025em] sm:text-[34px]">
              Valuation leads
            </h1>
            <p className="mt-2 text-[#525C7A]">
              Everyone who entered their email through the valuation funnel.
            </p>
          </div>
          <ExportButton
            leads={leads.map((l) => ({
              email: l.email,
              industry: l.industry,
              country: l.country,
              region: l.region,
              source: l.source,
              created_at: l.created_at,
            }))}
          />
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            Couldn&apos;t load leads: {error.message}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-[#DCE3F2] bg-white p-5 shadow-[0_18px_40px_-30px_rgba(14,19,48,0.3)]"
            >
              <div className="text-sm font-semibold text-[#525C7A]">{s.label}</div>
              <div className="mt-1 text-[32px] font-extrabold tracking-[-0.02em]">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-[#DCE3F2] bg-white">
          {leads.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-[18px] font-bold text-[#0E1330]">No leads yet</p>
              <p className="mt-2 text-[#525C7A]">
                New signups from the valuation tool will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E3E8F3] bg-[#F4F6FC] text-[#525C7A]">
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Industry</th>
                    <th className="px-5 py-3 font-semibold">Location</th>
                    <th className="px-5 py-3 font-semibold">Source</th>
                    <th className="px-5 py-3 font-semibold">Captured</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr
                      key={l.id}
                      className="border-b border-[#EEF1F8] last:border-0 hover:bg-[#F8FAFF]"
                    >
                      <td className="px-5 py-3 font-semibold text-[#0E1330]">{l.email}</td>
                      <td className="px-5 py-3 text-[#2C3656]">{l.industry || "—"}</td>
                      <td className="px-5 py-3 text-[#2C3656]">{locationLabel(l)}</td>
                      <td className="px-5 py-3 text-[#2C3656]">{l.source || "—"}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-[#525C7A]">
                        {fmtDateTime(l.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
