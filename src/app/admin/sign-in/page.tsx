'use client';

import { useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminSignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = getBrowserSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace('/admin');
  }

  return (
    <div className="min-h-[60vh] container flex items-center justify-center py-16">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-lg border p-6">
        <h1 className="text-xl font-semibold">Admin Sign In</h1>
        <div className="space-y-2">
          <label className="block text-sm">Email</label>
          <input className="w-full rounded border px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Password</label>
          <input className="w-full rounded border px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button disabled={loading} className="w-full rounded bg-primary px-4 py-2 text-white disabled:opacity-60" type="submit">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
