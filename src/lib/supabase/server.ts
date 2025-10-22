import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";

type ServiceClientOptions = {
  useServiceRole?: boolean;
};

// Ensure env is loaded when running in dev or misconfigured environments
const ensureEnvLoaded = (() => {
  let loaded = false;
  return () => {
    if (loaded) return;
    const candidates = [
      resolve(process.cwd(), ".env.local"),
      resolve(process.cwd(), ".env"),
      resolve(process.cwd(), "..", ".env.local"),
      resolve(process.cwd(), "..", ".env"),
    ];
    for (const p of candidates) {
      loadEnv({ path: p, override: false });
    }
    loaded = true;
  };
})();

function getSupabaseCredentials() {
  ensureEnvLoaded();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase URL or anon key is missing in environment variables.");
  }

  return { url, anonKey };
}

export async function getServerSupabaseClient() {
  // Ensure env exists; the helper reads NEXT_PUBLIC_SUPABASE_* from process.env
  getSupabaseCredentials();

  return createServerComponentClient<Database>({
    // Pass the cookies function directly per auth-helpers docs
    cookies,
  });
}

export function getServiceSupabaseClient(options: ServiceClientOptions = {}) {
  const { url, anonKey } = getSupabaseCredentials();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("Supabase service role key is missing in environment variables.");
  }

  return createClient<Database>(url, options.useServiceRole ? serviceRoleKey : anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
