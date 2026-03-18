'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { LogOut, Clock, Coffee, LogIn, FileText, Truck, SlidersHorizontal } from 'lucide-react';

type Action = 'clock_in' | 'clock_out' | 'break_start' | 'break_end';
type Status = 'out' | 'in' | 'on_break';
type Tab = 'clock' | 'dispatched' | 'settings';

const STATUS_LABELS: Record<Status, string> = {
  out: 'Clocked Out',
  in: 'Clocked In',
  on_break: 'On Break',
};

const STATUS_COLORS: Record<Status, string> = {
  out: 'text-[#9ca3af]',
  in: 'text-green-400',
  on_break: 'text-yellow-400',
};

function deriveStatus(lastAction: Action | null): Status {
  if (!lastAction || lastAction === 'clock_out') return 'out';
  if (lastAction === 'clock_in' || lastAction === 'break_end') return 'in';
  return 'on_break';
}

export default function ClockPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lastAction, setLastAction] = useState<Action | null>(null);
  const [recentEntries, setRecentEntries] = useState<{ action: Action; created_at: string }[]>([]);
  const [now, setNow] = useState(new Date());
  const [tab, setTab] = useState<Tab>('clock');

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/staff-portal'); return; }
      const role = session.user.user_metadata?.role;
      if (role === 'customer') { router.push('/customer-portal'); return; }
      setUser(session.user);
      await fetchEntries(session.user.id);
      setLoading(false);
    });
  }, [router]);

  async function fetchEntries(uid: string) {
    const res = await fetch(`/api/time?user_id=${uid}`);
    const data = await res.json();
    if (data.entries?.length) {
      setRecentEntries(data.entries);
      setLastAction(data.entries[0].action);
    }
  }

  async function handleAction(action: Action) {
    if (!user || submitting) return;
    setSubmitting(true);
    await fetch('/api/time', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, action }),
    });
    await fetchEntries(user.id);
    setSubmitting(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/staff-portal');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-[#9ca3af] text-sm">Loading...</p>
      </div>
    );
  }

  const status = deriveStatus(lastAction);
  const name = user?.user_metadata?.name || user?.email;
  const isAdmin = user?.user_metadata?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col pt-16 pb-24">

      {/* Clock Tab */}
      {tab === 'clock' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">

          {/* Clock display */}
          <div className="text-center mb-12">
            <p className="text-[#4b5563] text-sm mb-1">
              {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-7xl font-bold text-[#f5f5f5] tabular-nums tracking-tight">
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className={`text-xl font-semibold mt-4 ${STATUS_COLORS[status]}`}>
              {STATUS_LABELS[status]}
            </p>
            <p className="text-[#4b5563] text-sm mt-1">{name}</p>
          </div>

          {/* Action buttons — big */}
          <div className="w-full max-w-sm space-y-4">
            {status === 'out' && (
              <button
                onClick={() => handleAction('clock_in')}
                disabled={submitting}
                className="w-full py-7 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-2xl rounded-3xl transition-colors flex items-center justify-center gap-4 shadow-lg shadow-green-900/30"
              >
                <LogIn size={28} />
                Clock In
              </button>
            )}

            {status === 'in' && (
              <>
                <button
                  onClick={() => handleAction('break_start')}
                  disabled={submitting}
                  className="w-full py-7 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-bold text-2xl rounded-3xl transition-colors flex items-center justify-center gap-4 shadow-lg shadow-yellow-900/20"
                >
                  <Coffee size={28} />
                  Start Break
                </button>
                <button
                  onClick={() => handleAction('clock_out')}
                  disabled={submitting}
                  className="w-full py-7 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-bold text-2xl rounded-3xl transition-colors flex items-center justify-center gap-4 shadow-lg shadow-red-900/30"
                >
                  <LogOut size={28} />
                  Clock Out
                </button>
              </>
            )}

            {status === 'on_break' && (
              <>
                <button
                  onClick={() => handleAction('break_end')}
                  disabled={submitting}
                  className="w-full py-7 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-2xl rounded-3xl transition-colors flex items-center justify-center gap-4 shadow-lg shadow-green-900/30"
                >
                  <Clock size={28} />
                  End Break
                </button>
                <button
                  onClick={() => handleAction('clock_out')}
                  disabled={submitting}
                  className="w-full py-7 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-bold text-2xl rounded-3xl transition-colors flex items-center justify-center gap-4 shadow-lg shadow-red-900/30"
                >
                  <LogOut size={28} />
                  Clock Out
                </button>
              </>
            )}
          </div>

          {/* Recent activity */}
          {recentEntries.length > 0 && (
            <div className="w-full max-w-sm mt-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#4b5563] mb-3">Today&apos;s Activity</p>
              <div className="space-y-2">
                {recentEntries.slice(0, 5).map((entry, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#111111] border border-[#1f1f1f] rounded-xl px-4 py-3">
                    <span className="text-sm text-[#f5f5f5] capitalize">{entry.action.replace('_', ' ')}</span>
                    <span className="text-xs text-[#4b5563]">
                      {new Date(entry.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dispatched Tab */}
      {tab === 'dispatched' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111111] border border-[#1f1f1f] flex items-center justify-center mb-4">
            <Truck size={28} className="text-[#800000]" />
          </div>
          <h2 className="text-xl font-bold text-[#f5f5f5] mb-2">Dispatched Jobs</h2>
          <p className="text-[#4b5563] text-sm max-w-xs">
            Active dispatch and job assignments will appear here once the dispatch system is set up.
          </p>
          <span className="mt-4 text-xs border border-[#800000]/20 bg-[#800000]/10 text-[#c9a84c] rounded-full px-3 py-1 font-medium">Coming Soon</span>
        </div>
      )}

      {/* More Settings Tab */}
      {tab === 'settings' && (
        <div className="flex-1 flex flex-col px-6 py-8">
          <h2 className="text-lg font-bold text-[#f5f5f5] mb-6">More</h2>
          <div className="space-y-3">
            <Link
              href="/staff-portal/timesheet"
              className="flex items-center justify-between bg-[#111111] border border-[#1f1f1f] rounded-xl px-4 py-4 hover:border-[#800000]/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-[#800000]" />
                <span className="text-sm font-medium text-[#f5f5f5]">View Timesheet</span>
              </div>
              <span className="text-[#4b5563] text-xs">→</span>
            </Link>

            {isAdmin && (
              <Link
                href="/staff-portal/dashboard"
                className="flex items-center justify-between bg-[#111111] border border-[#1f1f1f] rounded-xl px-4 py-4 hover:border-[#800000]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <SlidersHorizontal size={18} className="text-[#800000]" />
                  <span className="text-sm font-medium text-[#f5f5f5]">Admin Dashboard</span>
                </div>
                <span className="text-[#4b5563] text-xs">→</span>
              </Link>
            )}

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 bg-[#111111] border border-[#1f1f1f] rounded-xl px-4 py-4 hover:border-red-900/40 transition-colors text-left"
            >
              <LogOut size={18} className="text-[#9ca3af]" />
              <span className="text-sm font-medium text-[#9ca3af]">Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-[#1f1f1f] flex z-40">
        <button
          onClick={() => setTab('clock')}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${tab === 'clock' ? 'text-[#800000]' : 'text-[#4b5563] hover:text-[#9ca3af]'}`}
        >
          <Clock size={22} />
          <span className="text-xs font-medium">Clock</span>
        </button>
        <button
          onClick={() => setTab('dispatched')}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${tab === 'dispatched' ? 'text-[#800000]' : 'text-[#4b5563] hover:text-[#9ca3af]'}`}
        >
          <Truck size={22} />
          <span className="text-xs font-medium">Dispatched</span>
        </button>
        <button
          onClick={() => setTab('settings')}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${tab === 'settings' ? 'text-[#800000]' : 'text-[#4b5563] hover:text-[#9ca3af]'}`}
        >
          <SlidersHorizontal size={22} />
          <span className="text-xs font-medium">More</span>
        </button>
      </div>
    </div>
  );
}
