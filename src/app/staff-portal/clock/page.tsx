'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import {
  LogOut, Clock, Coffee, LogIn, FileText, Truck, SlidersHorizontal,
  ShieldCheck, ShieldOff, X, MapPin, Navigation, CheckCircle,
  AlertCircle, Bell, BellOff, Play,
} from 'lucide-react';

type Action = 'clock_in' | 'clock_out' | 'break_start' | 'break_end';
type Status = 'out' | 'in' | 'on_break';
type Tab = 'clock' | 'dispatched' | 'settings';
type MfaSetupStep = 'idle' | 'qr' | 'confirm' | 'done';
type DispatchStatus = 'pending' | 'en_route' | 'on_site' | 'completed' | 'cancelled';

interface Dispatch {
  id: string;
  dispatched_at: string;
  arrived_at: string | null;
  completed_at: string | null;
  tech_id: string;
  customer_name: string;
  address: string;
  transcript: string;
  status: DispatchStatus;
  dispatched_by_name: string;
}

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

function useTimer(from: string | null) {
  const [elapsed, setElapsed] = useState('');
  useEffect(() => {
    if (!from) { setElapsed('—'); return; }
    const tick = () => {
      const ms = Date.now() - new Date(from).getTime();
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setElapsed(h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${m}:${String(s).padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [from]);
  return elapsed;
}

// ── Two-Factor Modal ─────────────────────────────────────────────────────────
function TwoFactorModal({ onClose }: { onClose: () => void }) {
  const [setupStep, setSetupStep] = useState<MfaSetupStep>('idle');
  const [enrolled, setEnrolled] = useState<boolean | null>(null);
  const [factorId, setFactorId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.mfa.listFactors().then(({ data }) => {
      setEnrolled((data?.totp?.length ?? 0) > 0);
      if (data?.totp?.[0]) setFactorId(data.totp[0].id);
    });
  }, []);

  async function startEnroll() {
    setLoading(true); setError('');
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', issuer: 'Bayou Office Machines', friendlyName: 'Authenticator App' });
    if (error || !data) { setError(error?.message ?? 'Failed.'); setLoading(false); return; }
    setFactorId(data.id); setQrCode(data.totp.qr_code); setSecret(data.totp.secret); setSetupStep('qr'); setLoading(false);
  }
  async function confirmEnroll() {
    if (code.length < 6) return;
    setLoading(true); setError('');
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
    if (error) { setError('Incorrect code.'); setLoading(false); return; }
    setSetupStep('done'); setEnrolled(true); setLoading(false);
  }
  async function unenroll() {
    setLoading(true); setError('');
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) { setError(error.message); setLoading(false); return; }
    setEnrolled(false); setFactorId(''); setSetupStep('idle'); setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="w-full max-w-sm bg-[#111111] rounded-2xl border border-[#1f1f1f] overflow-hidden">
        <div className="h-1 bg-[#800000]" />
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-[#800000]" /><h2 className="font-bold text-[#f5f5f5] text-sm">Two-Factor Authentication</h2></div>
          <button onClick={onClose} className="text-[#4b5563] hover:text-[#9ca3af] p-1"><X size={16} /></button>
        </div>
        <div className="px-5 pb-5">
          {enrolled === null && <p className="text-[#4b5563] text-sm text-center py-4">Loading…</p>}
          {enrolled === false && setupStep === 'idle' && (
            <>
              <p className="text-[#9ca3af] text-sm mb-4 leading-relaxed">Add an extra layer of security. You&apos;ll be asked for a 6-digit code from your authenticator app.</p>
              <p className="text-xs text-[#4b5563] mb-4">Works with Google Authenticator, Authy, or any TOTP app.</p>
              {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
              <button onClick={startEnroll} disabled={loading} className="w-full py-2.5 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">{loading ? 'Setting up…' : 'Set Up 2FA'}</button>
            </>
          )}
          {setupStep === 'qr' && (
            <>
              <p className="text-[#9ca3af] text-xs mb-4 leading-relaxed">Scan with your authenticator app, then enter the 6-digit code.</p>
              <div className="flex justify-center mb-4"><div className="bg-white p-3 rounded-xl"><img src={qrCode} alt="2FA QR code" width={160} height={160} /></div></div>
              <p className="text-xs text-[#4b5563] text-center mb-1">Manual code:</p>
              <p className="text-xs font-mono text-[#c9a84c] text-center break-all bg-[#141414] rounded-lg px-3 py-2 mb-4">{secret}</p>
              <input type="text" inputMode="numeric" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-4 py-3 text-[#f5f5f5] text-center text-xl font-mono tracking-[0.4em] focus:outline-none focus:border-[#800000] mb-3" autoFocus />
              {error && <p className="text-red-400 text-xs mb-3 text-center">{error}</p>}
              <button onClick={confirmEnroll} disabled={loading || code.length < 6} className="w-full py-2.5 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">{loading ? 'Verifying…' : 'Confirm & Enable'}</button>
            </>
          )}
          {setupStep === 'done' && (
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-3"><ShieldCheck size={22} className="text-green-400" /></div>
              <p className="font-semibold text-[#f5f5f5] mb-1">2FA Enabled!</p>
              <p className="text-[#9ca3af] text-xs mb-4">You&apos;ll be asked for a code every time you sign in.</p>
              <button onClick={onClose} className="w-full py-2.5 bg-[#800000] hover:bg-[#600000] text-white text-sm font-semibold rounded-xl transition-colors">Done</button>
            </div>
          )}
          {enrolled === true && setupStep === 'idle' && (
            <>
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-4"><ShieldCheck size={16} className="text-green-400 flex-shrink-0" /><p className="text-green-400 text-sm font-medium">2FA is active on your account</p></div>
              <p className="text-[#4b5563] text-xs mb-4 leading-relaxed">Your account is protected. You&apos;ll be prompted for a code each time you sign in.</p>
              {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
              <button onClick={unenroll} disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#111111] border border-red-900/30 hover:border-red-900/60 disabled:opacity-50 text-red-400 text-sm font-medium rounded-xl transition-colors"><ShieldOff size={14} />{loading ? 'Removing…' : 'Remove 2FA'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Dispatch Tab ─────────────────────────────────────────────────────────────
function DispatchTab({ user, status }: { user: User; status: Status }) {
  const [dispatch, setDispatch] = useState<Dispatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingOn, setTrackingOn] = useState(false);
  const [notifGranted, setNotifGranted] = useState(false);
  const [updating, setUpdating] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const lastSentRef = useRef<number>(0);
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  const travelTimer = useTimer(
    dispatch?.status === 'en_route' ? dispatch.dispatched_at :
    dispatch?.arrived_at ? dispatch.dispatched_at : null
  );
  const onSiteTimer = useTimer(
    dispatch?.status === 'on_site' ? dispatch.arrived_at ?? null : null
  );
  const totalTimer = useTimer(
    dispatch && !['completed','cancelled'].includes(dispatch.status) ? dispatch.dispatched_at : null
  );

  const canUseDispatch = status === 'in';

  const fetchDispatch = useCallback(async () => {
    const res = await fetch(`/api/dispatch?tech_id=${user.id}&status=active`);
    const data = await res.json();
    const active = (data.dispatches ?? []).find((d: Dispatch) =>
      ['pending', 'en_route', 'on_site'].includes(d.status)
    ) ?? null;
    setDispatch(active);
    setLoading(false);
  }, [user.id]);

  useEffect(() => { fetchDispatch(); }, [fetchDispatch]);

  // Auto-stop tracking if status changes away from 'in'
  useEffect(() => {
    if (status !== 'in' && trackingOn) stopTracking();
  }, [status, trackingOn]); // eslint-disable-line react-hooks/exhaustive-deps

  // Notification permission check
  useEffect(() => {
    if (typeof Notification !== 'undefined') setNotifGranted(Notification.permission === 'granted');
  }, []);

  async function requestNotif() {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      setNotifGranted(true);
      await subscribePush();
    }
  }

  async function subscribePush() {
    if (!vapidKey) return;
    try {
      const sw = await navigator.serviceWorker.ready;
      const sub = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, subscription: sub.toJSON(), role: user.user_metadata?.role }),
      });
    } catch {}
  }

  function startTracking() {
    if (!navigator.geolocation || !dispatch) return;
    const id = navigator.geolocation.watchPosition((pos) => {
      const now = Date.now();
      if (now - lastSentRef.current < 30000) return;
      lastSentRef.current = now;
      fetch('/api/dispatch/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dispatch_id: dispatch.id,
          tech_id: user.id,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      });
    }, () => {}, { enableHighAccuracy: true });
    watchIdRef.current = id;
    setTrackingOn(true);
  }

  function stopTracking() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTrackingOn(false);
  }

  // Cleanup on unmount
  useEffect(() => () => stopTracking(), []); // eslint-disable-line react-hooks/exhaustive-deps

  async function updateStatus(newStatus: DispatchStatus) {
    if (!dispatch) return;
    setUpdating(true);
    await fetch(`/api/dispatch/${dispatch.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    const messages: Partial<Record<DispatchStatus, string>> = {
      en_route: `${user.user_metadata?.name ?? 'Tech'} is en route to ${dispatch.customer_name}`,
      on_site:  `${user.user_metadata?.name ?? 'Tech'} arrived at ${dispatch.customer_name}`,
      completed:`${user.user_metadata?.name ?? 'Tech'} completed job at ${dispatch.customer_name}`,
    };
    if (messages[newStatus]) {
      await fetch('/api/push/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'admin',
          title: 'Dispatch Update',
          message: messages[newStatus],
          url: '/staff-portal/dispatch',
        }),
      });
    }

    if (newStatus === 'completed') {
      stopTracking();
    } else if (newStatus === 'en_route') {
      startTracking();
    }

    await fetchDispatch();
    setUpdating(false);
  }

  if (!canUseDispatch) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#111111] border border-[#1f1f1f] flex items-center justify-center mb-4">
          <AlertCircle size={28} className="text-[#800000]" />
        </div>
        <h2 className="text-lg font-bold text-[#f5f5f5] mb-2">Must Be Clocked In</h2>
        <p className="text-[#4b5563] text-sm max-w-xs">
          {status === 'on_break'
            ? 'Dispatch is unavailable while on break. End your break to access dispatch.'
            : 'Clock in to view and accept dispatch assignments.'}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#4b5563] text-sm">Loading…</p>
      </div>
    );
  }

  if (!dispatch) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#111111] border border-[#1f1f1f] flex items-center justify-center mb-4">
          <Truck size={28} className="text-[#800000]" />
        </div>
        <h2 className="text-lg font-bold text-[#f5f5f5] mb-2">No Active Dispatch</h2>
        <p className="text-[#4b5563] text-sm max-w-xs">Your admin will dispatch you when a job is ready. You&apos;ll get a notification.</p>

        {/* Notification setup */}
        <button
          onClick={notifGranted ? undefined : requestNotif}
          className={`mt-6 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
            notifGranted
              ? 'border-green-500/30 text-green-400 bg-green-500/10 cursor-default'
              : 'border-[#1f1f1f] text-[#9ca3af] hover:border-[#800000]/40'
          }`}
        >
          {notifGranted ? <Bell size={16} /> : <BellOff size={16} />}
          {notifGranted ? 'Notifications enabled' : 'Enable dispatch notifications'}
        </button>
      </div>
    );
  }

  const statusLabel: Record<DispatchStatus, string> = {
    pending: 'Dispatched — Waiting to Start',
    en_route: 'En Route',
    on_site: 'On Site',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  const statusColor: Record<DispatchStatus, string> = {
    pending:   'text-[#c9a84c]',
    en_route:  'text-blue-400',
    on_site:   'text-green-400',
    completed: 'text-[#9ca3af]',
    cancelled: 'text-red-400',
  };

  return (
    <div className="flex-1 flex flex-col px-4 py-6 space-y-4 max-w-md mx-auto w-full">
      {/* Status header */}
      <div className="text-center">
        <p className={`text-lg font-bold ${statusColor[dispatch.status]}`}>{statusLabel[dispatch.status]}</p>
        <p className="text-xs text-[#4b5563] mt-0.5">Dispatched by {dispatch.dispatched_by_name}</p>
      </div>

      {/* Job card */}
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
        <div className="h-1 bg-[#800000]" />
        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-0.5">Customer</p>
            <p className="text-sm font-bold text-[#f5f5f5]">{dispatch.customer_name}</p>
          </div>
          {dispatch.address && (
            <div>
              <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-0.5">Address</p>
              <div className="flex items-start gap-2">
                <p className="text-sm text-[#9ca3af] flex-1">{dispatch.address}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(dispatch.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors flex-shrink-0 font-medium"
                >
                  <Navigation size={12} />
                  Navigate
                </a>
              </div>
            </div>
          )}
          {dispatch.transcript && (
            <div>
              <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-0.5">Notes</p>
              <p className="text-sm text-[#9ca3af] leading-relaxed whitespace-pre-wrap">{dispatch.transcript}</p>
            </div>
          )}
        </div>
      </div>

      {/* Timers */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Travel', value: dispatch.arrived_at ? `${Math.floor((new Date(dispatch.arrived_at).getTime() - new Date(dispatch.dispatched_at).getTime()) / 60000)}m` : dispatch.status === 'en_route' ? travelTimer : '—', icon: <Navigation size={14} className="text-blue-400" /> },
          { label: 'On Site', value: dispatch.completed_at && dispatch.arrived_at ? `${Math.floor((new Date(dispatch.completed_at).getTime() - new Date(dispatch.arrived_at).getTime()) / 60000)}m` : dispatch.status === 'on_site' ? onSiteTimer : '—', icon: <MapPin size={14} className="text-green-400" /> },
          { label: 'Total', value: ['completed','cancelled'].includes(dispatch.status) ? '—' : totalTimer, icon: <Clock size={14} className="text-[#c9a84c]" /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1">{icon}</div>
            <p className="text-xs text-[#4b5563] mb-0.5">{label}</p>
            <p className="text-sm font-mono font-bold text-[#f5f5f5]">{value}</p>
          </div>
        ))}
      </div>

      {/* Location toggle */}
      {['pending', 'en_route', 'on_site'].includes(dispatch.status) && (
        <button
          onClick={trackingOn ? stopTracking : startTracking}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
            trackingOn
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              : 'bg-[#111111] border-[#1f1f1f] text-[#9ca3af] hover:border-[#800000]/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span className="text-sm font-medium">{trackingOn ? 'Location sharing ON' : 'Share my location'}</span>
          </div>
          <div className={`w-10 h-5 rounded-full transition-colors ${trackingOn ? 'bg-blue-500' : 'bg-[#1f1f1f]'}`}>
            <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${trackingOn ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
        </button>
      )}

      {/* Action buttons */}
      <div className="space-y-2">
        {dispatch.status === 'pending' && (
          <button
            onClick={() => updateStatus('en_route')}
            disabled={updating}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-lg rounded-2xl transition-colors flex items-center justify-center gap-3"
          >
            <Play size={22} />
            Start Route
          </button>
        )}
        {dispatch.status === 'en_route' && (
          <button
            onClick={() => updateStatus('on_site')}
            disabled={updating}
            className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-lg rounded-2xl transition-colors flex items-center justify-center gap-3"
          >
            <MapPin size={22} />
            Mark Arrived
          </button>
        )}
        {dispatch.status === 'on_site' && (
          <button
            onClick={() => updateStatus('completed')}
            disabled={updating}
            className="w-full py-4 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-bold text-lg rounded-2xl transition-colors flex items-center justify-center gap-3"
          >
            <CheckCircle size={22} />
            Complete Job
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Clock Page ───────────────────────────────────────────────────────────
function ClockPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lastAction, setLastAction] = useState<Action | null>(null);
  const [recentEntries, setRecentEntries] = useState<{ action: Action; created_at: string }[]>([]);
  const [now, setNow] = useState(new Date());
  const [tab, setTab] = useState<Tab>('clock');
  const [showMfa, setShowMfa] = useState(false);
  const [hasActiveDispatch, setHasActiveDispatch] = useState(false);

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
      await checkActiveDispatch(session.user.id);
      setLoading(false);
    });
  }, [router]);

  async function fetchEntries(uid: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const res = await fetch(`/api/time?user_id=${uid}&from=${todayStart.toISOString()}`);
    const data = await res.json();
    if (data.entries?.length) { setRecentEntries(data.entries); setLastAction(data.entries[0].action); }
    else { setRecentEntries([]); setLastAction(null); }
  }

  async function checkActiveDispatch(uid: string) {
    try {
      const res = await fetch(`/api/dispatch?tech_id=${uid}&status=active`);
      const data = await res.json();
      setHasActiveDispatch((data.dispatches ?? []).some((d: Dispatch) =>
        ['pending', 'en_route', 'on_site'].includes(d.status)
      ));
    } catch {}
  }

  async function handleAction(action: Action) {
    if (!user || submitting) return;
    setSubmitting(true);
    await fetch('/api/time', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id, action }) });
    await fetchEntries(user.id);
    setSubmitting(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/staff-portal');
  }

  if (loading) {
    return <div className="min-h-screen bg-[#141414] flex items-center justify-center"><p className="text-[#9ca3af] text-sm">Loading...</p></div>;
  }

  const status = deriveStatus(lastAction);
  const name = user?.user_metadata?.name || user?.email;
  const isAdmin = user?.user_metadata?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col pt-16 pb-24">
      {showMfa && <TwoFactorModal onClose={() => setShowMfa(false)} />}

      {isPreview && (
        <div className="bg-[#c9a84c]/10 border-b border-[#c9a84c]/30 px-6 py-2 flex items-center justify-between">
          <p className="text-[#c9a84c] text-xs font-semibold">Admin Preview — viewing as staff</p>
          <Link href="/staff-portal/dashboard" className="text-xs text-[#c9a84c] hover:underline font-medium">← Back to Dashboard</Link>
        </div>
      )}

      {/* Clock Tab */}
      {tab === 'clock' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="text-center mb-12">
            <p className="text-[#4b5563] text-sm mb-1">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <p className="text-7xl font-bold text-[#f5f5f5] tabular-nums tracking-tight">{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
            <p className={`text-xl font-semibold mt-4 ${STATUS_COLORS[status]}`}>{STATUS_LABELS[status]}</p>
            <p className="text-[#4b5563] text-sm mt-1">{name}</p>
          </div>

          <div className="w-full max-w-sm space-y-4">
            {status === 'out' && (
              <button onClick={() => handleAction('clock_in')} disabled={submitting} className="w-full py-7 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-2xl rounded-3xl transition-colors flex items-center justify-center gap-4 shadow-lg shadow-green-900/30">
                <LogIn size={28} />Clock In
              </button>
            )}
            {status === 'in' && (
              <>
                <button onClick={() => handleAction('break_start')} disabled={submitting} className="w-full py-7 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-bold text-2xl rounded-3xl transition-colors flex items-center justify-center gap-4 shadow-lg shadow-yellow-900/20">
                  <Coffee size={28} />Start Break
                </button>
                <button onClick={() => handleAction('clock_out')} disabled={submitting} className="w-full py-7 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-bold text-2xl rounded-3xl transition-colors flex items-center justify-center gap-4 shadow-lg shadow-red-900/30">
                  <LogOut size={28} />Clock Out
                </button>
              </>
            )}
            {status === 'on_break' && (
              <>
                <button onClick={() => handleAction('break_end')} disabled={submitting} className="w-full py-7 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-2xl rounded-3xl transition-colors flex items-center justify-center gap-4 shadow-lg shadow-green-900/30">
                  <Clock size={28} />End Break
                </button>
                <button onClick={() => handleAction('clock_out')} disabled={submitting} className="w-full py-7 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-bold text-2xl rounded-3xl transition-colors flex items-center justify-center gap-4 shadow-lg shadow-red-900/30">
                  <LogOut size={28} />Clock Out
                </button>
              </>
            )}
          </div>

          {recentEntries.length > 0 && (
            <div className="w-full max-w-sm mt-10">
              <div className="rounded-2xl overflow-hidden border border-[#1f1f1f] shadow-lg">
                <div className="bg-[#800000] px-5 pt-4 pb-3 flex items-end justify-between">
                  <div>
                    <p className="text-[#f5c0c0] text-xs font-bold uppercase tracking-widest mb-0.5">{now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    <p className="text-white text-6xl font-extrabold leading-none tabular-nums">{now.getDate()}</p>
                  </div>
                  <p className="text-[#f5c0c0] text-sm font-semibold pb-1">{now.toLocaleDateString('en-US', { weekday: 'long' })}</p>
                </div>
                <div className="bg-[#111111] px-5 py-4 space-y-0">
                  {[...recentEntries].reverse().map((entry, i, arr) => {
                    const dotColor = entry.action === 'clock_in' ? 'bg-green-500' : entry.action === 'clock_out' ? 'bg-[#800000]' : entry.action === 'break_start' ? 'bg-yellow-500' : 'bg-blue-400';
                    const label = entry.action === 'clock_in' ? 'Clock In' : entry.action === 'clock_out' ? 'Clock Out' : entry.action === 'break_start' ? 'Break Start' : 'Break End';
                    const isLast = i === arr.length - 1;
                    return (
                      <div key={i} className="flex items-stretch gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${dotColor}`} />
                          {!isLast && <div className="w-px flex-1 bg-[#2a2a2a] my-1" />}
                        </div>
                        <div className={`flex items-center justify-between w-full ${!isLast ? 'pb-4' : ''}`}>
                          <span className="text-sm font-medium text-[#f5f5f5]">{label}</span>
                          <span className="text-xs text-[#4b5563] tabular-nums">{new Date(entry.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dispatched Tab */}
      {tab === 'dispatched' && user && (
        <DispatchTab user={user} status={status} />
      )}

      {/* Settings Tab */}
      {tab === 'settings' && (
        <div className="flex-1 flex flex-col px-6 py-8">
          <h2 className="text-lg font-bold text-[#f5f5f5] mb-6">More</h2>
          <div className="space-y-3">
            <Link href="/staff-portal/timesheet" className="flex items-center justify-between bg-[#111111] border border-[#1f1f1f] rounded-xl px-4 py-4 hover:border-[#800000]/40 transition-colors">
              <div className="flex items-center gap-3"><FileText size={18} className="text-[#800000]" /><span className="text-sm font-medium text-[#f5f5f5]">View Timesheet</span></div>
              <span className="text-[#4b5563] text-xs">→</span>
            </Link>
            <button onClick={() => setShowMfa(true)} className="w-full flex items-center justify-between bg-[#111111] border border-[#1f1f1f] rounded-xl px-4 py-4 hover:border-[#800000]/40 transition-colors">
              <div className="flex items-center gap-3"><ShieldCheck size={18} className="text-[#800000]" /><span className="text-sm font-medium text-[#f5f5f5]">Two-Factor Auth</span></div>
              <span className="text-[#4b5563] text-xs">→</span>
            </button>
            {isAdmin && (
              <Link href="/staff-portal/dashboard" className="flex items-center justify-between bg-[#111111] border border-[#1f1f1f] rounded-xl px-4 py-4 hover:border-[#800000]/40 transition-colors">
                <div className="flex items-center gap-3"><SlidersHorizontal size={18} className="text-[#800000]" /><span className="text-sm font-medium text-[#f5f5f5]">Admin Dashboard</span></div>
                <span className="text-[#4b5563] text-xs">→</span>
              </Link>
            )}
            <button onClick={handleSignOut} className="w-full flex items-center gap-3 bg-[#111111] border border-[#1f1f1f] rounded-xl px-4 py-4 hover:border-red-900/40 transition-colors text-left">
              <LogOut size={18} className="text-[#9ca3af]" />
              <span className="text-sm font-medium text-[#9ca3af]">Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-[#1f1f1f] flex z-40">
        <button onClick={() => setTab('clock')} className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${tab === 'clock' ? 'text-[#800000]' : 'text-[#4b5563] hover:text-[#9ca3af]'}`}>
          <Clock size={22} /><span className="text-xs font-medium">Clock</span>
        </button>
        <button onClick={() => setTab('dispatched')} className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors relative ${tab === 'dispatched' ? 'text-[#800000]' : 'text-[#4b5563] hover:text-[#9ca3af]'}`}>
          <Truck size={22} />
          <span className="text-xs font-medium">Dispatch</span>
          {hasActiveDispatch && <span className="absolute top-2 right-1/4 w-2 h-2 bg-[#800000] rounded-full" />}
        </button>
        <button onClick={() => setTab('settings')} className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${tab === 'settings' ? 'text-[#800000]' : 'text-[#4b5563] hover:text-[#9ca3af]'}`}>
          <SlidersHorizontal size={22} /><span className="text-xs font-medium">More</span>
        </button>
      </div>
    </div>
  );
}

export default function ClockPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#141414] flex items-center justify-center"><p className="text-[#9ca3af] text-sm">Loading...</p></div>}>
      <ClockPageInner />
    </Suspense>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
