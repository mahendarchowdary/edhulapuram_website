'use client';

import { getBrowserSupabase } from '@/lib/supabase/client';

export function SignOutButton() {
  async function onClick() {
    const supabase = getBrowserSupabase();
    await supabase.auth.signOut();
    window.location.href = '/admin/sign-in';
  }
  return (
    <button onClick={onClick} className="rounded bg-secondary px-3 py-1.5 text-sm">
      Sign out
    </button>
  );
}
