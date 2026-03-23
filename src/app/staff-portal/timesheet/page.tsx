'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Entry = { id: string; action: string; created_at: string };

type DaySummary = {
  date: string;
  entries: Entry[];
  clockIn: Date | null;
  clockOut: Date | null;
  totalBreakMs: number;
  totalWorkedMs: number;
};

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatDuration(ms: number) {
  if (ms <= 0) return '—';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function groupByDay(entries: Entry[]): DaySummary[] {
  const days: Record<string, Entry[]> = {};

  // Sort oldest first for processing
  const sorted = [...entries].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  for (const entry of sorted) {
    const day = new Date(entry.created_at).toLocaleDateString('en-US');
    if (!days[day]) days[day] = [];
    days[day].push(entry);
  }

  return Object.entries(days).map(([date, dayEntries]) => {
    let clockIn: Date | null = null;
    let clockOut: Date | null = null;
    let breakStart: Date | null = null;
    let totalBreakMs = 0;

    for (const e of dayEntries) {
      const t = new Date(e.created_at);
      if (e.action === 'clock_in' && !clockIn) clockIn = t;
      if (e.action === 'clock_out') clockOut = t;
      if (e.action === 'break_start') breakStart = t;
      if (e.action === 'break_end' && breakStart) {
        totalBreakMs += t.getTime() - breakStart.getTime();
        breakStart = null;
      }
    }

    const totalWorkedMs =
      clockIn && clockOut
        ? clockOut.getTime() - clockIn.getTime() - totalBreakMs
        : 0;

    return { date, entries: dayEntries, clockIn, clockOut, totalBreakMs, totalWorkedMs };
  }).reverse(); // Most recent first
}

export default function TimesheetPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<DaySummary[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/staff-portal'); return; }
      const role = session.user.user_metadata?.role;
      if (role === 'customer') { router.push('/customer-portal'); return; }
      setUser(session.user);

      const res = await fetch(`/api/time?user_id=${session.user.id}&limit=200`);
      const data = await res.json();
      if (data.entries) setDays(groupByDay(data.entries));
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <p className="text-[#9ca3af] text-sm">Loading...</p>
      </div>
    );
  }

  const name = user?.user_metadata?.name || user?.email;
  const backHref = user?.user_metadata?.role === 'admin'
    ? '/staff-portal/dashboard'
    : '/staff-portal/clock';

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-card { border: 1px solid #ccc !important; background: white !important; }
          .print-header { color: black !important; }
        }
      `}</style>

      <div className="min-h-screen bg-[#141414] pt-16 md:pt-[100px]">
        <div className="max-w-3xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 no-print">
            <Link
              href={backHref}
              className="flex items-center gap-2 text-sm text-[#9ca3af] hover:text-[#f5f5f5] transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
          </div>

          {/* Print header (visible on print) */}
          <div className="mb-8 print-header">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-1 no-print">Timesheet</p>
            <h1 className="text-2xl font-extrabold text-[#f5f5f5]">Bayou Office Machines</h1>
            <p className="text-[#9ca3af] text-sm mt-1">
              Employee: <span className="text-[#f5f5f5] font-medium">{name}</span>
              &nbsp;·&nbsp;Printed: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {days.length === 0 ? (
            <p className="text-[#4b5563] text-sm">No time entries found.</p>
          ) : (
            <div className="space-y-6">
              {days.map((day) => (
                <div key={day.date} className="bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden print-card">
                  {/* Day header */}
                  <div className="px-6 py-4 border-b border-[#1f1f1f] flex items-center justify-between">
                    <p className="font-semibold text-[#f5f5f5] text-sm">{formatDate(day.date)}</p>
                    <p className="text-xs text-[#c9a84c] font-semibold">
                      {day.totalWorkedMs > 0 ? `${formatDuration(day.totalWorkedMs)} worked` : 'Incomplete'}
                    </p>
                  </div>

                  {/* Summary row */}
                  <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-[#1f1f1f]">
                    <div>
                      <p className="text-xs text-[#4b5563] uppercase tracking-widest mb-1">Clock In</p>
                      <p className="text-[#f5f5f5] font-medium text-sm">
                        {day.clockIn ? formatTime(day.clockIn) : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#4b5563] uppercase tracking-widest mb-1">Clock Out</p>
                      <p className="text-[#f5f5f5] font-medium text-sm">
                        {day.clockOut ? formatTime(day.clockOut) : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#4b5563] uppercase tracking-widest mb-1">Break Time</p>
                      <p className="text-[#f5f5f5] font-medium text-sm">
                        {day.totalBreakMs > 0 ? formatDuration(day.totalBreakMs) : 'None'}
                      </p>
                    </div>
                  </div>

                  {/* All entries */}
                  <div className="px-6 py-3 space-y-2">
                    {day.entries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between text-sm">
                        <span className="text-[#9ca3af] capitalize">{entry.action.replace('_', ' ')}</span>
                        <span className="text-[#4b5563] tabular-nums">
                          {formatTime(new Date(entry.created_at))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Total summary */}
              <div className="bg-[#800000]/10 border border-[#800000]/30 rounded-xl px-6 py-4 flex items-center justify-between print-card">
                <p className="font-bold text-[#f5f5f5]">Total Hours ({days.length} day{days.length !== 1 ? 's' : ''})</p>
                <p className="font-bold text-[#c9a84c] text-lg">
                  {formatDuration(days.reduce((sum, d) => sum + d.totalWorkedMs, 0))}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
