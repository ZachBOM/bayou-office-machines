'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CustomerPortal() {
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
      setError('Incorrect email or password.');
      setLoading(false);
      return;
    }

    // Block staff from using the customer portal
    const role = data.user.user_metadata?.role;
    if (role === 'admin' || role === 'staff') {
      await supabase.auth.signOut();
      setError('Please use the Staff Portal to log in.');
      setLoading(false);
      return;
    }

    router.push('/customer-portal/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex pt-16">
      {/* Left — maroon panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#800000] flex-col justify-between p-12">
        <div>
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">Customer Portal</p>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-6">
            Manage your<br />equipment &<br />service requests.
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            Submit service calls, track repair status, view your equipment, and request upgrades — all in one place.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            Submit service calls
          </div>
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            Track repair status
          </div>
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            View your equipment
          </div>
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            Request upgrades
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-2">Customer Login</p>
            <h2 className="text-2xl font-extrabold text-[#f5f5f5]">Sign in to your account</h2>
            <p className="text-[#9ca3af] text-sm mt-1">
              Don&apos;t have access?{' '}
              <a href="tel:9856937811" className="text-[#c9a84c] hover:underline">Call us at 985-693-7811</a>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
    </div>
  );
}
