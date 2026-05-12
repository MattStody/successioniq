import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import BulkUploadClient from "./BulkUploadClient";

export default async function BulkUploadPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "broker") redirect("/dashboard");

  return (
    <Suspense fallback={<div className="py-24 text-center text-slate-400 text-sm">Loading…</div>}>
      <BulkUploadClient />
    </Suspense>
  );
}
