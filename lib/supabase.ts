import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazily-created anon client. Creating it at module load throws
// "supabaseUrl is required" whenever the module is imported without env vars
// present (e.g. during `next build` page-data collection), so we defer
// construction until first use and keep a singleton thereafter.
let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}

// Proxy preserves the `import { supabase }` call sites while deferring the
// actual client creation to the first property access at request time.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const c = getClient();
    const value = c[prop as keyof SupabaseClient];
    return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(c) : value;
  },
});
