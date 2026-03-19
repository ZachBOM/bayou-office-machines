'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Printer, ArrowLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';

type Entry = { id: string; user_id: string; action: string; created_at: string };

type DaySummary = {
  date: string;
  entries: Entry[];
  clockIn: Date | null;
  clockOut: Date | null;
  totalBreakMs: number;
  totalWorkedMs: number;
};

type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  entries: Entry[];
};

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(ms: number) {
  if (ms <= 0) return '—';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

function groupByDay(entries: Entry[]): DaySummary[] {
  const days: Record<string, Entry[]> = {};
  for (const entry of entries) {
    const day = new Date(entry.created_at).toLocaleDateString('en-US');
    if (!days[day]) days[day] = [];
    days[day].push(entry);
  }

  return Object.entries(days).map(([date, dayEntries]) => {
    const sorted = [...dayEntries].sort((a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    let clockIn: Date | null = null;
    let clockOut: Date | null = null;
    let breakStart: Date | null = null;
    let totalBreakMs = 0;

    for (const e of sorted) {
      const t = new Date(e.created_at);
      if (e.action === 'clock_in' && !clockIn) clockIn = t;
      if (e.action === 'clock_out') clockOut = t;
      if (e.action === 'break_start') breakStart = t;
      if (e.action === 'break_end' && breakStart) {
        totalBreakMs += t.getTime() - breakStart.getTime();
        breakStart = null;
      }
    }

    const totalWorkedMs = clockIn && clockOut
      ? clockOut.getTime() - clockIn.getTime() - totalBreakMs
      : 0;

    return { date, entries: sorted, clockIn, clockOut, totalBreakMs, totalWorkedMs };
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

const PERIOD_KEY = 'bom_pay_period_start';

function getPeriodStart(): string {
  if (typeof window === 'undefined') return '';
  const saved = localStorage.getItem(PERIOD_KEY);
  if (saved) return saved;
  // Default: 14 days ago
  const d = new Date();
  d.setDate(d.getDate() - 14);
  return d.toISOString().split('T')[0];
}

export default function AdminTimesheetsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [periodStart, setPeriodStart] = useState('');
  const [showReset, setShowReset] = useState(false);

  const periodEnd = new Date().toISOString().split('T')[0];

  const fetchData = useCallback(async (from: string) => {
    const toISO = new Date().toISOString();
    const fromISO = new Date(from + 'T00:00:00').toISOString();
    const res = await fetch(`/api/admin/timesheets?from=${fromISO}&to=${toISO}`);
    const data = await res.json();
    setStaff(data.users || []);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/staff-portal'); return; }
      if (session.user.user_metadata?.role !== 'admin') { router.push('/staff-portal'); return; }
      const start = getPeriodStart();
      setPeriodStart(start);
      await fetchData(start);
      setLoading(false);
    });
  }, [router, fetchData]);

  async function handleReset() {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(PERIOD_KEY, today);
    setPeriodStart(today);
    setShowReset(false);
    await fetchData(today);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-[#9ca3af] text-sm">Loading...</p>
      </div>
    );
  }

  const totalMs = staff.reduce((sum, s) =>
    sum + groupByDay(s.entries).reduce((d, day) => d + day.totalWorkedMs, 0), 0
  );

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-card { border: 1px solid #ccc !important; background: white !important; color: black !important; }
          .print-white { color: black !important; }
        }
      `}</style>

      <div className="min-h-screen bg-[#0a0a0a] pt-16">
        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 no-print">
            <div className="flex items-center gap-4">
              <Link href="/staff-portal/dashboard" className="flex items-center gap-2 text-sm text-[#9ca3af] hover:text-[#f5f5f5] transition-colors">
                <ArrowLeft size={16} /> Back
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReset(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] border border-[#1f1f1f] hover:border-[#800000]/40 text-[#9ca3af] hover:text-[#f5f5f5] text-sm font-medium rounded-lg transition-colors"
              >
                <RotateCcw size={14} />
                Reset Pay Period
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#800000] hover:bg-[#600000] text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Printer size={16} />
                Print All
              </button>
            </div>
          </div>

          {/* Reset confirmation modal */}
          {showReset && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 no-print">
              <div className="w-full max-w-sm bg-[#111111] rounded-xl border border-[#1f1f1f] p-6">
                <h3 className="font-bold text-[#f5f5f5] mb-2">Reset Pay Period?</h3>
                <p className="text-[#9ca3af] text-sm mb-6">
                  This starts a new pay period from today. Make sure you&apos;ve already printed this period&apos;s timesheets before resetting. Old records are never deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowReset(false)}
                    className="flex-1 py-2.5 bg-[#111111] border border-[#1f1f1f] text-[#9ca3af] rounded-lg text-sm font-medium hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2.5 bg-[#800000] hover:bg-[#600000] text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    Yes, Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Print header */}
          <div className="mb-8 print-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-1 no-print">Time &amp; Attendance</p>
            <h1 className="text-2xl font-extrabold text-[#f5f5f5] print-white">Bayou Office Machines — Payroll Timesheet</h1>
            <p className="text-[#9ca3af] text-sm mt-1 print-white">
              Pay period: <span className="text-[#f5f5f5] font-medium">{new Date(periodStart + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              {' '}–{' '}
              <span className="text-[#f5f5f5] font-medium">{new Date(periodEnd + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </p>
          </div>

          {staff.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#9ca3af] text-sm font-medium">Pay period reset — no entries yet.</p>
              <p className="text-[#4b5563] text-xs mt-1">New period started: {new Date(periodStart + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {staff.map((member) => {
                const days = groupByDay(member.entries);
                const totalWorked = days.reduce((s, d) => s + d.totalWorkedMs, 0);
                return (
                  <div key={member.id} className="print-card bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden">
                    {/* Employee header */}
                    <div className="px-6 py-4 border-b border-[#1f1f1f] flex items-center justify-between bg-[#0d0d0d]">
                      <div>
                        <p className="font-bold text-[#f5f5f5] print-white">{member.name}</p>
                        <p className="text-xs text-[#4b5563]">{member.email} · {member.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#4b5563] uppercase tracking-widest">Total</p>
                        <p className="font-bold text-[#c9a84c] text-lg">{formatDuration(totalWorked)}</p>
                      </div>
                    </div>

                    {/* Days */}
                    <div className="divide-y divide-[#1f1f1f]">
                      {days.map((day) => (
                        <div key={day.date} className="px-6 py-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-[#f5f5f5] print-white">{formatDate(day.date)}</p>
                            <p className="text-xs text-[#c9a84c] font-semibold">
                              {day.totalWorkedMs > 0 ? formatDuration(day.totalWorkedMs) : 'Incomplete'}
                            </p>
                          </div>
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div>
                              <p className="text-xs text-[#4b5563] mb-0.5">Clock In</p>
                              <p className="text-sm text-[#f5f5f5] print-white">{day.clockIn ? formatTime(day.clockIn) : '—'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-[#4b5563] mb-0.5">Clock Out</p>
                              <p className="text-sm text-[#f5f5f5] print-white">{day.clockOut ? formatTime(day.clockOut) : '—'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-[#4b5563] mb-0.5">Break</p>
                              <p className="text-sm text-[#f5f5f5] print-white">{day.totalBreakMs > 0 ? formatDuration(day.totalBreakMs) : 'None'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Grand total */}
              <div className="print-card bg-[#800000]/10 border border-[#800000]/30 rounded-xl px-6 py-4 flex items-center justify-between">
                <p className="font-bold text-[#f5f5f5] print-white">Grand Total — {staff.length} employee{staff.length !== 1 ? 's' : ''}</p>
                <p className="font-bold text-[#c9a84c] text-xl">{formatDuration(totalMs)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
