import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import OnboardingClient from "./OnboardingClient";

export default async function BuyerOnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "buyer") redirect("/dashboard");

  const { data: existingProfile } = await supabase
    .from("buyer_profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (existingProfile) redirect("/buyer/dashboard");

  return (
    <OnboardingClient
      initialName={profile?.full_name ?? ""}
      userEmail={profile?.email ?? user.email ?? ""}
    />
  );
}
