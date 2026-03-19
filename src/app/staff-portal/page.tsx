'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function StaffPortal() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }

    const role = data.user.user_metadata?.role;
    if (role === 'admin') {
      router.push('/staff-portal/dashboard');
    } else if (role === 'staff') {
      router.push('/staff-portal/clock');
    } else {
      await supabase.auth.signOut();
      setError('You do not have staff access.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center px-6 pt-16">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-[#800000]/10 border border-[#800000]/30 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-6">
            Staff Only
          </div>
          <h1 className="text-3xl font-extrabold text-[#f5f5f5] mb-2">Staff Login</h1>
          <p className="text-[#9ca3af] text-sm">Bayou Office Machines internal access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@bayouoffice.com"
              className="w-full bg-[#111111] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-colors text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#111111] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-colors text-sm"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
