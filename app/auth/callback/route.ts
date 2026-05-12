import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { UserRole } from "@/lib/types";

const VALID_ROLES: UserRole[] = ["seller", "buyer", "broker"];

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Role is stored in a cookie set client-side before the magic link was sent.
  // This is the most reliable channel — it travels with the redirect request.
  const pendingRole = request.cookies.get("pending_role")?.value as
    | UserRole
    | undefined;

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        let currentRole: UserRole = (profile?.role as UserRole) ?? "seller";

        // Apply the pending role only if:
        // - a non-seller role was chosen
        // - the profile is still at the default (prevents overwriting on re-login)
        if (
          pendingRole &&
          VALID_ROLES.includes(pendingRole) &&
          pendingRole !== "seller" &&
          currentRole === "seller"
        ) {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: pendingRole })
            .eq("id", user.id);

          if (!updateError) {
            currentRole = pendingRole;
          }
        }

        const destination =
          currentRole === "broker"
            ? `${origin}/broker/dashboard`
            : `${origin}/dashboard`;

        const response = NextResponse.redirect(destination);
        // Clear the pending_role cookie
        response.cookies.set("pending_role", "", { maxAge: 0, path: "/" });
        return response;
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=true`);
}
