import { createSupabaseServerClient } from "@/lib/supabase-server";
import ValuateClient from "./ValuateClient";

export const metadata = {
  title: "Free Business Valuation — SuccessionIQ",
  description:
    "Get an AI-powered business valuation in under 3 minutes. Free, no strings attached.",
};

export default async function ValuatePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <ValuateClient isLoggedIn={!!user} />;
}
