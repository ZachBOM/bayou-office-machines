'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

type Step = 'credentials' | 'mfa_verify';

export default function StaffPortal() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [factorId, setFactorId] = useState('');
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
    if (role !== 'admin' && role !== 'staff') {
      await supabase.auth.signOut();
      setError('You do not have staff access.');
      setLoading(false);
      return;
    }

    // Check if MFA is required
    const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aalData?.nextLevel === 'aal2') {
      // User has MFA enrolled — get their factor ID and prompt for code
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totp = factors?.totp?.[0];
      if (totp) {
        setFactorId(totp.id);
        setStep('mfa_verify');
        setLoading(false);
        return;
      }
    }

    // No MFA enrolled — proceed directly
    redirectByRole(role);
  }

  async function handleMfaVerify(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: mfaCode.replace(/\s/g, ''),
    });

    if (error) {
      setError('Incorrect code. Try again.');
      setLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    const role = session?.user?.user_metadata?.role;
    redirectByRole(role);
  }

  function redirectByRole(role: string) {
    if (role === 'admin') {
      router.push('/staff-portal/dashboard');
    } else {
      router.push('/staff-portal/clock');
    }
  }

  // ── Credentials step ─────────────────────────────────────────────
  if (step === 'credentials') {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center px-6 pt-16 md:pt-[100px]">
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

  // ── MFA verify step ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center px-6 pt-16 md:pt-[100px]">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#800000]/10 border border-[#800000]/30 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck size={26} className="text-[#800000]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#f5f5f5] mb-2">Two-Factor Auth</h1>
          <p className="text-[#9ca3af] text-sm">
            Open your authenticator app and enter the 6-digit code.
          </p>
        </div>

        <form onSubmit={handleMfaVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Authentication Code</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              maxLength={7}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              placeholder="000 000"
              className="w-full bg-[#111111] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-colors text-sm text-center text-xl tracking-[0.4em] font-mono"
              autoFocus
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || mfaCode.replace(/\s/g, '').length < 6}
            className="w-full py-3 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>

          <button
            type="button"
            onClick={() => { setStep('credentials'); setError(''); setMfaCode(''); }}
            className="w-full flex items-center justify-center gap-1.5 text-sm text-[#4b5563] hover:text-[#9ca3af] transition-colors"
          >
            <ArrowLeft size={13} /> Back to login
          </button>
        </form>
      </div>
    </div>
  );
}
