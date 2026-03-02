import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Lazy-init to avoid build-time errors when env vars aren't set
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseAnonKey || "placeholder-key"
    );
  }
  return _supabase;
}

// Keep backward-compatible export as a getter
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getSupabase() as any)[prop];
  },
});

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  plan: "free" | "pro" | "team";
  portone_payment_id: string | null;
  billing_key: string | null;
  subscription_started_at: string | null;
  created_at: string;
};
