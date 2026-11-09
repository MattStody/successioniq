import { createSupabaseServerClient } from "@/lib/supabase-server";
import { normalizeIndustry } from "@/lib/financials";
import ValuateClient from "./ValuateClient";

export const metadata = {
  title: "Free Business Valuation — Mercato",
  description:
    "Get an AI-powered business valuation in under 3 minutes. Free, no strings attached.",
};

export default async function ValuatePage({
  searchParams,
}: {
  searchParams: Promise<{ quick?: string; revenue?: string; industry?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { quick, revenue, industry } = await searchParams;
  const quickMode = quick === "1";

  // Carry revenue/industry forward from the landing page (and the quick funnel)
  // so owners never retype what they already entered. Industry arrives as a
  // slug ("trades") or a label and is normalized to the canonical funnel value.
  const canonicalIndustry = industry ? normalizeIndustry(industry) : null;
  const prefill = {
    ...(revenue ? { revenue } : {}),
    ...(canonicalIndustry ? { industry: canonicalIndustry } : {}),
  };

  return (
    <ValuateClient
      isLoggedIn={!!user}
      quickMode={quickMode}
      initialData={Object.keys(prefill).length ? prefill : undefined}
    />
  );
}
