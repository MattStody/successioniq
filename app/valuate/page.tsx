import { createSupabaseServerClient } from "@/lib/supabase-server";
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

  return (
    <ValuateClient
      isLoggedIn={!!user}
      quickMode={quickMode}
      initialData={
        quickMode
          ? {
              ...(revenue ? { revenue } : {}),
              ...(industry ? { industry } : {}),
            }
          : undefined
      }
    />
  );
}
