import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/**
 * Create a Supabase client for client-side operations
 * This should only be used in client components
 */
export function createClient() {
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
