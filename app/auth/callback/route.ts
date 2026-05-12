import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { UserRole } from "@/lib/types";

const VALID_ROLES: UserRole[] = ["seller", "buyer", "broker"];

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const roleParam = searchParams.get("role") as UserRole | null;

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
        // Fetch the current profile role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        let currentRole: UserRole = (profile?.role as UserRole) ?? "seller";

        // Update role if a valid non-default role was selected and current is still default
        if (
          roleParam &&
          VALID_ROLES.includes(roleParam) &&
          roleParam !== "seller" &&
          currentRole === "seller"
        ) {
          await supabase
            .from("profiles")
            .update({ role: roleParam })
            .eq("id", user.id);
          currentRole = roleParam;
        }

        // Redirect based on role
        if (currentRole === "broker") {
          return NextResponse.redirect(`${origin}/broker/dashboard`);
        }
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=true`);
}
