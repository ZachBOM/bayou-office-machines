'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { LogOut, Clock, Coffee, LogIn, FileText } from 'lucide-react';

type Action = 'clock_in' | 'clock_out' | 'break_start' | 'break_end';
type Status = 'out' | 'in' | 'on_break';

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col pt-16">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">

        {/* Clock */}
        <div className="text-center mb-10">
          <p className="text-[#4b5563] text-sm mb-1">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <p className="text-6xl font-bold text-[#f5f5f5] tabular-nums tracking-tight">
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className={`text-lg font-semibold mt-3 ${STATUS_COLORS[status]}`}>
            {STATUS_LABELS[status]}
          </p>
          <p className="text-[#4b5563] text-sm mt-1">{name}</p>
        </div>

        {/* Action buttons */}
        <div className="w-full max-w-xs space-y-3">
          {status === 'out' && (
            <button
              onClick={() => handleAction('clock_in')}
              disabled={submitting}
              className="w-full py-5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-lg rounded-2xl transition-colors flex items-center justify-center gap-3"
            >
              <LogIn size={22} />
              Clock In
            </button>
          )}

          {status === 'in' && (
            <>
              <button
                onClick={() => handleAction('break_start')}
                disabled={submitting}
                className="w-full py-5 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-bold text-lg rounded-2xl transition-colors flex items-center justify-center gap-3"
              >
                <Coffee size={22} />
                Start Break
              </button>
              <button
                onClick={() => handleAction('clock_out')}
                disabled={submitting}
                className="w-full py-5 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-bold text-lg rounded-2xl transition-colors flex items-center justify-center gap-3"
              >
                <LogOut size={22} />
                Clock Out
              </button>
            </>
          )}

          {status === 'on_break' && (
            <>
              <button
                onClick={() => handleAction('break_end')}
                disabled={submitting}
                className="w-full py-5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-lg rounded-2xl transition-colors flex items-center justify-center gap-3"
              >
                <Clock size={22} />
                End Break
              </button>
              <button
                onClick={() => handleAction('clock_out')}
                disabled={submitting}
                className="w-full py-5 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-bold text-lg rounded-2xl transition-colors flex items-center justify-center gap-3"
              >
                <LogOut size={22} />
                Clock Out
              </button>
            </>
          )}
        </div>

        {/* Recent activity */}
        {recentEntries.length > 0 && (
          <div className="w-full max-w-xs mt-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4b5563] mb-3">Today&apos;s Activity</p>
            <div className="space-y-2">
              {recentEntries.slice(0, 5).map((entry, i) => (
                <div key={i} className="flex items-center justify-between bg-[#111111] border border-[#1f1f1f] rounded-lg px-4 py-2.5">
                  <span className="text-sm text-[#f5f5f5] capitalize">{entry.action.replace('_', ' ')}</span>
                  <span className="text-xs text-[#4b5563]">
                    {new Date(entry.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom links */}
        <div className="mt-10 flex items-center gap-6">
          {user?.user_metadata?.role === 'admin' && (
            <Link
              href="/staff-portal/dashboard"
              className="text-sm text-[#4b5563] hover:text-[#9ca3af] transition-colors"
            >
              ← Dashboard
            </Link>
          )}
          <Link
            href="/staff-portal/timesheet"
            className="flex items-center gap-1.5 text-sm text-[#4b5563] hover:text-[#9ca3af] transition-colors"
          >
            <FileText size={14} />
            View Timesheet
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm text-[#4b5563] hover:text-[#9ca3af] transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
