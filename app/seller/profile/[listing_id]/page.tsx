import { createSupabaseServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { Listing } from "@/lib/types"
import ProfileEditor from "./ProfileEditor"

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ listing_id: string }>
}) {
  const { listing_id } = await params
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listing_id)
    .single()

  if (error || !listing || listing.user_id !== user.id) {
    redirect("/dashboard")
  }

  return <ProfileEditor listing={listing as Listing} />
}
