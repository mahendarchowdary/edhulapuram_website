"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  return createBrowserClient<Database>(url, anonKey);
}
