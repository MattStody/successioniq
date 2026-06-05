import { createSupabaseServerClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import ValuateClient from "../../ValuateClient";

export const dynamic = "force-dynamic";

export default async function EditValuationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: v } = await supabase
    .from("valuations")
    .select(
      "id, industry, country, region, annual_revenue, annual_profit, years_operating, revenue_trend, owner_dependency, customer_concentration, reason_for_selling, asking_price"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!v) notFound();

  const initialData = {
    industry: v.industry,
    country: v.country,
    region: v.region,
    revenue: String(v.annual_revenue),
    netProfit: String(v.annual_profit),
    yearsInOperation: String(v.years_operating),
    revenueTrend: (v.revenue_trend as string) ?? "",
    ownerDependency: (v.owner_dependency as number) ?? 5,
    customerConcentration: (v.customer_concentration as string) ?? "",
    reasonForSelling: (v.reason_for_selling as string) ?? "",
    askingPrice: v.asking_price ? String(v.asking_price) : "",
  };

  return (
    <ValuateClient
      isLoggedIn={true}
      initialData={initialData}
      editMode={true}
      editValuationId={id}
    />
  );
}
