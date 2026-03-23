'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Printer, ArrowLeft, RotateCcw, Calendar, Pencil, Plus, Trash2 } from 'lucide-react';
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

function formatDisplayDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
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

type EditEntry = {
  _key: string;        // unique key for React list
  id?: string;         // present for existing entries
  action: string;
  datetime: string;    // datetime-local format: YYYY-MM-DDTHH:mm
  _delete?: boolean;
};

type EditModal = {
  member: StaffMember;
  day: DaySummary;
};

function toDatetimeLocal(isoStr: string): string {
  const d = new Date(isoStr);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const ACTION_LABELS: Record<string, string> = {
  clock_in: 'Clock In',
  clock_out: 'Clock Out',
  break_start: 'Break Start',
  break_end: 'Break End',
};

const PERIOD_KEY = 'bom_pay_period_start';

function getPeriodStart(): string {
  if (typeof window === 'undefined') return '';
  const saved = localStorage.getItem(PERIOD_KEY);
  if (saved) return saved;
  const d = new Date();
  d.setDate(d.getDate() - 14);
  return d.toISOString().split('T')[0];
}

function today() {
  return new Date().toISOString().split('T')[0];
}

export default function AdminTimesheetsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState(today());
  const [showReset, setShowReset] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [draftStart, setDraftStart] = useState('');
  const [draftEnd, setDraftEnd] = useState(today());
  const [editModal, setEditModal] = useState<EditModal | null>(null);
  const [editEntries, setEditEntries] = useState<EditEntry[]>([]);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const fetchData = useCallback(async (from: string, to: string) => {
    const fromISO = new Date(from + 'T00:00:00').toISOString();
    // Include the full end day through 23:59:59
    const toDate = new Date(to + 'T23:59:59');
    const toISO = toDate.toISOString();
    const res = await fetch(`/api/admin/timesheets?from=${fromISO}&to=${toISO}`);
    const data = await res.json();
    setStaff(data.users || []);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/staff-portal'); return; }
      if (session.user.user_metadata?.role !== 'admin') { router.push('/staff-portal'); return; }
      const start = getPeriodStart();
      const end = today();
      setPeriodStart(start);
      setPeriodEnd(end);
      setDraftStart(start);
      setDraftEnd(end);
      await fetchData(start, end);
      setLoading(false);
    });
  }, [router, fetchData]);

  async function handleReset() {
    const t = today();
    localStorage.setItem(PERIOD_KEY, t);
    setPeriodStart(t);
    setPeriodEnd(t);
    setDraftStart(t);
    setDraftEnd(t);
    setShowReset(false);
    await fetchData(t, t);
  }

  function handleApplyDates() {
    if (!draftStart || !draftEnd) return;
    if (draftStart > draftEnd) return;
    localStorage.setItem(PERIOD_KEY, draftStart);
    setPeriodStart(draftStart);
    setPeriodEnd(draftEnd);
    setShowDatePicker(false);
    fetchData(draftStart, draftEnd);
  }

  function openEdit(member: StaffMember, day: DaySummary) {
    const entries: EditEntry[] = day.entries.map((e, i) => ({
      _key: `existing-${e.id}-${i}`,
      id: e.id,
      action: e.action,
      datetime: toDatetimeLocal(e.created_at),
    }));
    setEditEntries(entries);
    setEditModal({ member, day });
    setEditError('');
  }

  function addEditEntry(day: DaySummary) {
    // Default to noon on the same day
    const base = new Date(day.date);
    const pad = (n: number) => String(n).padStart(2, '0');
    const dt = `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}T12:00`;
    setEditEntries(prev => [...prev, {
      _key: `new-${Date.now()}`,
      action: 'clock_in',
      datetime: dt,
    }]);
  }

  function updateEditEntry(key: string, field: 'action' | 'datetime', value: string) {
    setEditEntries(prev => prev.map(e => e._key === key ? { ...e, [field]: value } : e));
  }

  function markDeleteEntry(key: string) {
    setEditEntries(prev => prev.map(e => e._key === key ? { ...e, _delete: !e._delete } : e));
  }

  function removeNewEntry(key: string) {
    setEditEntries(prev => prev.filter(e => e._key !== key));
  }

  async function saveEdit() {
    if (!editModal) return;
    setEditSaving(true);
    setEditError('');
    try {
      const original = editModal.day.entries;
      for (const e of editEntries) {
        if (e._delete && e.id) {
          const res = await fetch(`/api/time?id=${e.id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error(`Delete failed: ${(await res.json()).error}`);
        } else if (!e._delete && e.id) {
          const orig = original.find(o => o.id === e.id);
          const newISO = new Date(e.datetime).toISOString();
          if (orig && (orig.action !== e.action || toDatetimeLocal(orig.created_at) !== e.datetime)) {
            const res = await fetch('/api/time', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: e.id, action: e.action, created_at: newISO }),
            });
            if (!res.ok) throw new Error(`Update failed: ${(await res.json()).error}`);
          }
        } else if (!e._delete && !e.id) {
          const res = await fetch('/api/time', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: editModal.member.id,
              action: e.action,
              created_at: new Date(e.datetime).toISOString(),
            }),
          });
          if (!res.ok) throw new Error(`Add failed: ${(await res.json()).error}`);
        }
      }
      setEditModal(null);
      await fetchData(periodStart, periodEnd);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setEditSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
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

      <div className="min-h-screen bg-[#141414] pt-16 md:pt-[100px]">
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
                onClick={() => { setDraftStart(periodStart); setDraftEnd(periodEnd); setShowDatePicker(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] border border-[#1f1f1f] hover:border-[#800000]/40 text-[#9ca3af] hover:text-[#f5f5f5] text-sm font-medium rounded-lg transition-colors"
              >
                <Calendar size={14} />
                Date Range
              </button>
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

          {/* Date range picker modal */}
          {showDatePicker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 no-print">
              <div className="w-full max-w-sm bg-[#111111] rounded-xl border border-[#1f1f1f] p-6">
                <h3 className="font-bold text-[#f5f5f5] mb-1">Select Date Range</h3>
                <p className="text-[#4b5563] text-xs mb-5">Choose the start and end dates to view.</p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#4b5563] mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={draftStart}
                      max={draftEnd}
                      onChange={e => setDraftStart(e.target.value)}
                      className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] text-sm focus:outline-none focus:border-[#800000]/60 [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#4b5563] mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={draftEnd}
                      min={draftStart}
                      max={today()}
                      onChange={e => setDraftEnd(e.target.value)}
                      className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] text-sm focus:outline-none focus:border-[#800000]/60 [color-scheme:dark]"
                    />
                  </div>
                </div>

                {draftStart > draftEnd && (
                  <p className="text-xs text-red-400 mb-4">Start date must be before end date.</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="flex-1 py-2.5 bg-[#111111] border border-[#1f1f1f] text-[#9ca3af] rounded-lg text-sm font-medium hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyDates}
                    disabled={!draftStart || !draftEnd || draftStart > draftEnd}
                    className="flex-1 py-2.5 bg-[#800000] hover:bg-[#600000] disabled:opacity-40 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit entries modal */}
          {editModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 no-print">
              <div className="w-full max-w-lg bg-[#111111] rounded-xl border border-[#1f1f1f] p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="font-bold text-[#f5f5f5] mb-0.5">Edit Time Entries</h3>
                <p className="text-[#4b5563] text-xs mb-5">
                  {editModal.member.name} · {formatDate(editModal.day.date)}
                </p>

                <div className="space-y-2 mb-4">
                  {editEntries.map((e) => (
                    <div
                      key={e._key}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border ${e._delete ? 'opacity-40 border-red-900/40 bg-red-900/10' : 'border-[#2a2a2a] bg-[#141414]'}`}
                    >
                      <select
                        value={e.action}
                        disabled={e._delete}
                        onChange={ev => updateEditEntry(e._key, 'action', ev.target.value)}
                        className="flex-shrink-0 bg-[#111111] border border-[#2a2a2a] rounded-lg px-2 py-1.5 text-[#f5f5f5] text-xs focus:outline-none focus:border-[#800000]/60"
                      >
                        {Object.entries(ACTION_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                      <input
                        type="datetime-local"
                        value={e.datetime}
                        disabled={e._delete}
                        onChange={ev => updateEditEntry(e._key, 'datetime', ev.target.value)}
                        className="flex-1 bg-[#111111] border border-[#2a2a2a] rounded-lg px-2 py-1.5 text-[#f5f5f5] text-xs focus:outline-none focus:border-[#800000]/60 [color-scheme:dark] min-w-0"
                      />
                      {e.id ? (
                        <button
                          onClick={() => markDeleteEntry(e._key)}
                          className={`p-1.5 rounded-lg transition-colors ${e._delete ? 'text-[#9ca3af] hover:text-white' : 'text-red-400 hover:text-red-300 hover:bg-red-900/20'}`}
                          title={e._delete ? 'Undo' : 'Delete'}
                        >
                          <Trash2 size={13} />
                        </button>
                      ) : (
                        <button
                          onClick={() => removeNewEntry(e._key)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addEditEntry(editModal.day)}
                  className="flex items-center gap-1.5 text-xs text-[#c9a84c] hover:text-[#e8c46a] mb-5 transition-colors"
                >
                  <Plus size={13} /> Add Entry
                </button>

                {editError && <p className="text-xs text-red-400 mb-4">{editError}</p>}

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditModal(null)}
                    disabled={editSaving}
                    className="flex-1 py-2.5 bg-[#111111] border border-[#1f1f1f] text-[#9ca3af] rounded-lg text-sm font-medium hover:text-white transition-colors disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    disabled={editSaving}
                    className="flex-1 py-2.5 bg-[#800000] hover:bg-[#600000] disabled:opacity-40 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    {editSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

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
              {periodStart === periodEnd
                ? <>Date: <span className="text-[#f5f5f5] font-medium">{formatDisplayDate(periodStart)}</span></>
                : <>Period: <span className="text-[#f5f5f5] font-medium">{formatDisplayDate(periodStart)}</span>{' '}–{' '}<span className="text-[#f5f5f5] font-medium">{formatDisplayDate(periodEnd)}</span></>
              }
            </p>
          </div>

          {staff.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#9ca3af] text-sm font-medium">No entries found for this date range.</p>
              <p className="text-[#4b5563] text-xs mt-1">{formatDisplayDate(periodStart)} – {formatDisplayDate(periodEnd)}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {staff.map((member) => {
                const days = groupByDay(member.entries);
                const totalWorked = days.reduce((s, d) => s + d.totalWorkedMs, 0);
                return (
                  <div key={member.id} className="print-card bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden">
                    {/* Employee header */}
                    <div className="px-6 py-4 border-b border-[#1f1f1f] flex items-center justify-between bg-[#111111]">
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
                            <div className="flex items-center gap-3">
                              <p className="text-xs text-[#c9a84c] font-semibold">
                                {day.totalWorkedMs > 0 ? formatDuration(day.totalWorkedMs) : 'Incomplete'}
                              </p>
                              <button
                                onClick={() => openEdit(member, day)}
                                className="no-print flex items-center gap-1 px-2 py-1 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#800000]/50 text-[#9ca3af] hover:text-[#f5f5f5] text-xs transition-colors"
                              >
                                <Pencil size={11} /> Edit
                              </button>
                            </div>
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
