'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import {
  Truck, Plus, X, ArrowLeft, MapPin, Clock, User as UserIcon,
  Phone, FileText, CheckCircle, Navigation, Bell, BellOff,
  RefreshCw, AlertCircle,
} from 'lucide-react';

type DispatchStatus = 'pending' | 'en_route' | 'on_site' | 'awaiting_review' | 'completed' | 'cancelled';

interface Dispatch {
  id: string;
  created_at: string;
  dispatched_at: string;
  arrived_at: string | null;
  completed_at: string | null;
  tech_id: string;
  tech_name: string;
  customer_id: string | null;
  customer_name: string;
  address: string;
  transcript: string;
  status: DispatchStatus;
  dispatched_by: string;
  dispatched_by_name: string;
}

interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  address: string;
}

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const STATUS_CONFIG: Record<DispatchStatus, { label: string; color: string; dot: string }> = {
  pending:         { label: 'Pending',          color: 'text-[#c9a84c] bg-[#c9a84c]/10 border-[#c9a84c]/30',  dot: 'bg-[#c9a84c]' },
  en_route:        { label: 'En Route',         color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',     dot: 'bg-blue-400' },
  on_site:         { label: 'On Site',          color: 'text-green-400 bg-green-400/10 border-green-400/30',  dot: 'bg-green-400' },
  awaiting_review: { label: 'Awaiting Review',  color: 'text-purple-400 bg-purple-400/10 border-purple-400/30', dot: 'bg-purple-400 animate-pulse' },
  completed:       { label: 'Completed',        color: 'text-[#9ca3af] bg-[#9ca3af]/10 border-[#9ca3af]/30', dot: 'bg-[#9ca3af]' },
  cancelled:       { label: 'Cancelled',        color: 'text-red-400 bg-red-400/10 border-red-400/30',       dot: 'bg-red-400' },
};

function elapsedStr(from: string | null, to: string | null = null): string {
  if (!from) return '—';
  const start = new Date(from).getTime();
  const end = to ? new Date(to).getTime() : Date.now();
  const mins = Math.floor((end - start) / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function mapsLink(address: string) {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

export default function DispatchBoard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'active' | 'all'>('active');
  const [showNew, setShowNew] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notifGranted, setNotifGranted] = useState(false);
  const [notifStatus, setNotifStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'error'>('idle');
  const [notifError, setNotifError] = useState('');
  const [showNotifHelp, setShowNotifHelp] = useState(false);
  const [now, setNow] = useState(new Date());
  const [locations, setLocations] = useState<Record<string, { lat: number; lng: number; created_at: string }>>({});
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  // New dispatch form
  const [form, setForm] = useState({
    tech_id: '', tech_name: '',
    customer_id: '', customer_name: '', address: '',
    transcript: '',
  });
  const [newCustomer, setNewCustomer] = useState({ name: '', company: '', phone: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const locPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const addressDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Live clock for timers
  useEffect(() => {
    tickRef.current = setInterval(() => setNow(new Date()), 10000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  // Poll tech locations every 30s
  async function fetchLocations() {
    const res = await fetch('/api/dispatch/location');
    const data = await res.json();
    const map: Record<string, { lat: number; lng: number; created_at: string }> = {};
    for (const loc of data.locations ?? []) {
      map[loc.dispatch_id] = { lat: loc.lat, lng: loc.lng, created_at: loc.created_at };
    }
    setLocations(map);
  }

  useEffect(() => {
    fetchLocations();
    locPollRef.current = setInterval(fetchLocations, 30000);
    return () => { if (locPollRef.current) clearInterval(locPollRef.current); };
  }, []);

  async function searchAddress(query: string) {
    if (query.length < 4) { setAddressSuggestions([]); setShowSuggestions(false); return; }
    setAddressLoading(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const results: string[] = data.results ?? [];
      setAddressSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch {
      setAddressSuggestions([]);
    } finally {
      setAddressLoading(false);
    }
  }

  function handleAddressChange(value: string) {
    setForm(f => ({ ...f, address: value }));
    if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current);
    addressDebounceRef.current = setTimeout(() => searchAddress(value), 350);
  }

  function pickSuggestion(suggestion: string) {
    setForm(f => ({ ...f, address: suggestion }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
  }

  const load = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) { router.push('/staff-portal'); return; }
    const u = data.session.user;
    const role = u.user_metadata?.role;
    if (role !== 'admin' && role !== 'staff') { router.push('/staff-portal'); return; }
    setUser(u);

    // Load dispatches
    const [dispRes, custRes] = await Promise.all([
      fetch(`/api/dispatch?status=${filter}`),
      fetch('/api/customers'),
    ]);
    const dispData = await dispRes.json();
    const custData = await custRes.json();
    setDispatches(dispData.dispatches ?? []);
    setCustomers(custData.customers ?? []);

    // Load staff users for tech selector
    const staffRes = await fetch('/api/admin/staff-users');
    const staffData = await staffRes.json();
    setStaffUsers(staffData.users ?? []);

    setLoading(false);
  }, [filter, router]);

  useEffect(() => { load(); }, [load]);

  // Check notification permission on mount
  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      const perm = Notification.permission;
      setNotifGranted(perm === 'granted');
      setNotifStatus(perm === 'granted' ? 'granted' : perm === 'denied' ? 'denied' : 'idle');
    }
  }, []);

  async function requestNotifications() {
    if (!('Notification' in window)) {
      setNotifError('Your browser does not support notifications.');
      setNotifStatus('error');
      return;
    }
    if (Notification.permission === 'denied') {
      setNotifStatus('denied');
      setShowNotifHelp(true);
      return;
    }
    setNotifStatus('requesting');
    setNotifError('');
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      setNotifGranted(true);
      setNotifStatus('granted');
      await subscribePush();
    } else if (perm === 'denied') {
      setNotifStatus('denied');
      setShowNotifHelp(true);
    } else {
      setNotifStatus('idle');
    }
  }

  async function unsubscribePush() {
    try {
      const sw = await navigator.serviceWorker.ready;
      const sub = await sw.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      if (user) await fetch(`/api/push/subscribe?user_id=${user.id}`, { method: 'DELETE' });
      setNotifGranted(false);
      setNotifStatus('idle');
    } catch (err) {
      setNotifError(err instanceof Error ? err.message : 'Failed to disable');
      setNotifStatus('error');
    }
  }

  async function subscribePush() {
    if (!user) return;
    if (!vapidKey) {
      setNotifError('Push key not configured. Contact admin.');
      setNotifStatus('error');
      return;
    }
    try {
      if (!('serviceWorker' in navigator)) throw new Error('Service workers not supported');
      const sw = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('SW timeout')), 5000)),
      ]);
      const sub = await (sw as ServiceWorkerRegistration).pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          subscription: sub.toJSON(),
          role: user.user_metadata?.role,
        }),
      });
      if (!res.ok) throw new Error('Failed to save subscription');
    } catch (err) {
      setNotifError(`Subscription failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setNotifStatus('error');
      setNotifGranted(false);
    }
  }

  async function handleNewDispatch(e: React.FormEvent) {
    e.preventDefault();
    if (!form.tech_id || !form.customer_name) {
      setFormError('Select a tech and enter a customer name.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          customer_id: form.customer_id || null,
          dispatched_by: user!.id,
          dispatched_by_name: user!.user_metadata?.name ?? user!.email,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to create dispatch');
      // Notify the tech (best-effort — don't fail dispatch if push fails)
      fetch('/api/push/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_ids: [form.tech_id],
          title: '🚚 You\'ve Been Dispatched',
          message: `Job at ${form.customer_name}${form.address ? ' — ' + form.address : ''}. Open the app to start your route.`,
          url: '/staff-portal/clock',
        }),
      }).catch(() => {});
      setShowNew(false);
      setForm({ tech_id: '', tech_name: '', customer_id: '', customer_name: '', address: '', transcript: '' });
      setAddressSuggestions([]);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    }
    setSubmitting(false);
  }

  async function addCustomer(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer),
    });
    const data = await res.json();
    if (data.customer) {
      setCustomers((prev) => [...prev, data.customer]);
      setForm((f) => ({ ...f, customer_id: data.customer.id, customer_name: data.customer.name, address: data.customer.address || '' }));
      setShowCustomerForm(false);
      setNewCustomer({ name: '', company: '', phone: '', address: '' });
    }
  }

  async function updateStatus(id: string, status: DispatchStatus) {
    await fetch(`/api/dispatch/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    // Notify admin on status changes
    const dispatch = dispatches.find((d) => d.id === id);
    if (dispatch && user) {
      const messages: Partial<Record<DispatchStatus, string>> = {
        en_route:  `${dispatch.tech_name} is en route to ${dispatch.customer_name}`,
        on_site:   `${dispatch.tech_name} has arrived at ${dispatch.customer_name}`,
        completed: `${dispatch.tech_name} completed job at ${dispatch.customer_name}`,
      };
      if (messages[status]) {
        await fetch('/api/push/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: 'admin',
            title: 'Dispatch Update',
            message: messages[status],
            url: '/staff-portal/dispatch',
          }),
        });
      }
    }
    await load();
  }

  const activeCount = dispatches.filter((d) => ['pending', 'en_route', 'on_site', 'awaiting_review'].includes(d.status)).length;
  void now; // used in timer rendering via direct Date.now() calls

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center pt-16 md:pt-[100px]">
        <p className="text-[#9ca3af] text-sm">Loading dispatch board…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] pt-16 md:pt-[100px]">
      {/* Header */}
      <div className="border-b border-[#1f1f1f] bg-[#111111]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/staff-portal/dashboard" className="text-[#4b5563] hover:text-[#9ca3af] transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[#f5f5f5]">Dispatch Board</h1>
              <p className="text-xs text-[#4b5563]">
                {activeCount} active dispatch{activeCount !== 1 ? 'es' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button
              onClick={notifStatus === 'granted' ? unsubscribePush : requestNotifications}
              title={
                notifStatus === 'granted' ? 'Notifications enabled' :
                notifStatus === 'denied' ? 'Blocked — click for help' :
                notifStatus === 'requesting' ? 'Requesting…' :
                'Enable notifications'
              }
              className={`p-2 rounded-lg border transition-all ${
                notifStatus === 'granted' ? 'bg-white border-white text-[#111111] shadow-md shadow-white/20 cursor-default' :
                notifStatus === 'denied' ? 'border-red-500/40 text-red-400 bg-red-500/10 hover:bg-red-500/20' :
                notifStatus === 'error' ? 'border-orange-500/40 text-orange-400 bg-orange-500/10 hover:bg-orange-500/20' :
                notifStatus === 'requesting' ? 'border-[#c9a84c]/40 text-[#c9a84c] animate-pulse cursor-wait' :
                'border-[#1f1f1f] text-[#4b5563] hover:text-[#9ca3af] hover:border-[#9ca3af]/40'
              }`}
            >
              {notifStatus === 'granted' ? <Bell size={16} /> : <BellOff size={16} />}
            </button>
            <button
              onClick={load}
              className="p-2 rounded-lg border border-[#1f1f1f] text-[#4b5563] hover:text-[#9ca3af] transition-colors"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => setShowNew(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#800000] hover:bg-[#600000] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Dispatch</span>
              <span className="sm:hidden">Dispatch</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 bg-[#111111] border border-[#1f1f1f] rounded-xl p-1 w-fit">
          {(['active', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                filter === f ? 'bg-[#800000] text-white' : 'text-[#4b5563] hover:text-[#9ca3af]'
              }`}
            >
              {f === 'active' ? `Active${activeCount > 0 ? ` (${activeCount})` : ''}` : 'All'}
            </button>
          ))}
        </div>

        {/* Notification status banners */}
        {notifStatus === 'error' && notifError && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{notifError}</p>
          </div>
        )}

        {(notifStatus === 'denied' || showNotifHelp) && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-4 mb-6 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm font-semibold">Notifications blocked by your browser</p>
              </div>
              <button onClick={() => setShowNotifHelp(false)} className="text-[#4b5563] hover:text-[#9ca3af]"><X size={14} /></button>
            </div>
            <p className="text-sm text-[#9ca3af] leading-relaxed">To enable notifications for this site:</p>
            <ol className="text-sm text-[#9ca3af] space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Click the <strong className="text-[#f5f5f5]">lock icon 🔒</strong> in your browser address bar</li>
              <li>Find <strong className="text-[#f5f5f5]">Notifications</strong> and set it to <strong className="text-[#f5f5f5]">Allow</strong></li>
              <li>Refresh this page</li>
            </ol>
            <p className="text-xs text-[#4b5563]">On Windows you may also need: Settings → System → Notifications → allow your browser.</p>
          </div>
        )}

        {notifStatus === 'idle' && (
          <div className="flex items-start gap-3 bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={16} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
            <p className="text-[#c9a84c] text-sm">
              Enable notifications to be alerted when techs update their dispatch status.{' '}
              <button onClick={requestNotifications} className="underline font-semibold">Enable now</button>
            </p>
          </div>
        )}

        {/* Dispatch list */}
        {dispatches.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[#111111] border border-[#1f1f1f] flex items-center justify-center mx-auto mb-4">
              <Truck size={28} className="text-[#800000]" />
            </div>
            <p className="text-[#f5f5f5] font-semibold mb-1">No dispatches</p>
            <p className="text-[#4b5563] text-sm">Create one to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dispatches.map((d) => {
              const cfg = STATUS_CONFIG[d.status];
              const isExpanded = expandedId === d.id;
              const isActive = ['pending', 'en_route', 'on_site', 'awaiting_review'].includes(d.status);
              const travelMs = d.arrived_at
                ? new Date(d.arrived_at).getTime() - new Date(d.dispatched_at).getTime()
                : d.status === 'en_route' ? Date.now() - new Date(d.dispatched_at).getTime() : null;
              const onSiteMs = d.completed_at
                ? new Date(d.completed_at).getTime() - new Date(d.arrived_at!).getTime()
                : d.status === 'on_site' && d.arrived_at ? Date.now() - new Date(d.arrived_at).getTime() : null;

              return (
                <div key={d.id} className={`bg-[#111111] border rounded-2xl overflow-hidden transition-all ${isActive ? 'border-[#1f1f1f]' : 'border-[#1a1a1a] opacity-75'}`}>
                  {/* Status bar */}
                  <div className={`h-1 ${cfg.dot}`} />

                  <div className="p-4">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          <span className="text-xs text-[#4b5563]">
                            {new Date(d.dispatched_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserIcon size={14} className="text-[#800000] flex-shrink-0" />
                          <span className="text-sm font-bold text-[#f5f5f5]">{d.tech_name || 'Unknown Tech'}</span>
                        </div>
                        <div className="flex items-start gap-2 mt-1">
                          <MapPin size={14} className="text-[#800000] flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-[#9ca3af]">{d.customer_name}{d.address ? ` — ${d.address}` : ''}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : d.id)}
                        className="text-[#4b5563] hover:text-[#9ca3af] p-1 flex-shrink-0"
                      >
                        {isExpanded ? <X size={16} /> : <FileText size={16} />}
                      </button>
                    </div>

                    {/* Timers row */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#1a1a1a]">
                      <div className="flex items-center gap-1.5">
                        <Navigation size={12} className="text-blue-400" />
                        <span className="text-xs text-[#4b5563]">Travel:</span>
                        <span className="text-xs font-mono text-[#f5f5f5]">
                          {travelMs != null ? `${Math.floor(travelMs / 60000)}m` : '—'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-green-400" />
                        <span className="text-xs text-[#4b5563]">On-site:</span>
                        <span className="text-xs font-mono text-[#f5f5f5]">
                          {onSiteMs != null ? `${Math.floor(onSiteMs / 60000)}m` : '—'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-[#c9a84c]" />
                        <span className="text-xs text-[#4b5563]">Total:</span>
                        <span className="text-xs font-mono text-[#f5f5f5]">{elapsedStr(d.dispatched_at, d.completed_at)}</span>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="mt-4 space-y-3">
                        {d.transcript && (
                          <div className="bg-[#141414] rounded-xl p-3 border border-[#1f1f1f]">
                            <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-1.5">Transcript / Notes</p>
                            <p className="text-sm text-[#9ca3af] leading-relaxed whitespace-pre-wrap">{d.transcript}</p>
                          </div>
                        )}

                        {d.address && (
                          <a
                            href={mapsLink(d.address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <MapPin size={14} />
                            Open Job Address in Maps
                          </a>
                        )}

                        {/* Live tech location + map */}
                        {(() => {
                          const loc = locations[d.id];
                          if (!loc) return isActive ? (
                            <p className="text-xs text-[#4b5563] flex items-center gap-1.5">
                              <Navigation size={11} /> Waiting for tech to share location…
                            </p>
                          ) : null;
                          const age = Math.floor((Date.now() - new Date(loc.created_at).getTime()) / 60000);
                          const ageLabel = age < 1 ? 'just now' : `${age}m ago`;
                          const delta = 0.008;
                          const bbox = `${loc.lng - delta},${loc.lat - delta},${loc.lng + delta},${loc.lat + delta}`;
                          const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${loc.lat},${loc.lng}`;
                          return (
                            <div className="space-y-2">
                              {/* Status bar */}
                              <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                  <span className="text-xs font-medium text-blue-400">Live Location</span>
                                  <span className="text-xs text-[#4b5563]">· updated {ageLabel}</span>
                                </div>
                                <a
                                  href={`https://maps.google.com/?q=${loc.lat},${loc.lng}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  <Navigation size={12} /> Open in Maps
                                </a>
                              </div>
                              {/* Embedded map */}
                              <div className="rounded-xl overflow-hidden border border-[#2a2a2a]">
                                <iframe
                                  key={`${loc.lat},${loc.lng}`}
                                  src={mapSrc}
                                  width="100%"
                                  height="220"
                                  style={{ border: 'none', display: 'block' }}
                                  title="Tech location"
                                />
                              </div>
                            </div>
                          );
                        })()}

                        {/* Admin status controls */}
                        {isActive && (
                          <div className="space-y-2">
                            {d.status === 'awaiting_review' && (
                              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-2.5">
                                <p className="text-xs font-semibold text-purple-400 mb-0.5">Tech marked this job complete</p>
                                <p className="text-xs text-[#9ca3af]">Review the job and verify to close it out.</p>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {d.status === 'pending' && (
                                <button onClick={() => updateStatus(d.id, 'en_route')} className="px-3 py-1.5 text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
                                  Mark En Route
                                </button>
                              )}
                              {d.status === 'en_route' && (
                                <button onClick={() => updateStatus(d.id, 'on_site')} className="px-3 py-1.5 text-xs font-semibold bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors">
                                  Mark Arrived
                                </button>
                              )}
                              {d.status === 'on_site' && (
                                <button onClick={() => updateStatus(d.id, 'completed')} className="px-3 py-1.5 text-xs font-semibold bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] rounded-lg hover:bg-[#c9a84c]/20 transition-colors">
                                  <CheckCircle size={12} className="inline mr-1" />
                                  Mark Complete
                                </button>
                              )}
                              {d.status === 'awaiting_review' && (
                                <button onClick={() => updateStatus(d.id, 'completed')} className="px-3 py-1.5 text-xs font-semibold bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors flex items-center gap-1">
                                  <CheckCircle size={12} />
                                  Verify &amp; Complete
                                </button>
                              )}
                              <button onClick={() => updateStatus(d.id, 'cancelled')} className="px-3 py-1.5 text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-[#4b5563]">Dispatched by {d.dispatched_by_name}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── New Dispatch Modal ─────────────────────────────────────── */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-4 pb-4 sm:pb-0">
          <div className="w-full max-w-md bg-[#111111] rounded-2xl border border-[#1f1f1f] overflow-hidden max-h-[90vh] flex flex-col">
            <div className="h-1 bg-[#800000]" />
            <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-[#800000]" />
                <h2 className="font-bold text-[#f5f5f5]">New Dispatch</h2>
              </div>
              <button onClick={() => setShowNew(false)} className="text-[#4b5563] hover:text-[#9ca3af] p-1"><X size={16} /></button>
            </div>

            <form onSubmit={handleNewDispatch} className="px-5 pb-5 overflow-y-auto space-y-4">
              {/* Tech selector */}
              <div>
                <label className="block text-xs font-semibold text-[#f5f5f5] mb-1.5">Service Tech</label>
                <select
                  value={form.tech_id}
                  onChange={(e) => {
                    const opt = e.target.options[e.target.selectedIndex];
                    setForm((f) => ({ ...f, tech_id: e.target.value, tech_name: opt.text }));
                  }}
                  className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] focus:outline-none focus:border-[#800000]"
                  required
                >
                  <option value="">Select tech…</option>
                  {staffUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              {/* Customer selector */}
              {!showCustomerForm ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#f5f5f5]">Customer</label>
                    <button type="button" onClick={() => setShowCustomerForm(true)} className="text-xs text-[#800000] hover:text-[#a00000] font-medium flex items-center gap-1">
                      <Plus size={12} /> Add New
                    </button>
                  </div>
                  <select
                    value={form.customer_id}
                    onChange={(e) => {
                      const cust = customers.find((c) => c.id === e.target.value);
                      setForm((f) => ({
                        ...f,
                        customer_id: e.target.value,
                        customer_name: cust?.name ?? '',
                        address: cust?.address ?? '',
                      }));
                    }}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] focus:outline-none focus:border-[#800000]"
                  >
                    <option value="">Select customer (or type below)…</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ''}</option>
                    ))}
                  </select>
                  {/* Freeform if not in list */}
                  <input
                    type="text"
                    placeholder="Or type customer name…"
                    value={form.customer_name}
                    onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value, customer_id: '' }))}
                    className="mt-2 w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000]"
                  />
                </div>
              ) : (
                <div className="bg-[#141414] rounded-xl border border-[#1f1f1f] p-3 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-[#c9a84c]">Add New Customer</p>
                    <button type="button" onClick={() => setShowCustomerForm(false)} className="text-[#4b5563] hover:text-[#9ca3af]"><X size={14} /></button>
                  </div>
                  {(['name', 'company', 'phone', 'address'] as const).map((field) => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1) + (field === 'name' ? ' *' : '')}
                      value={newCustomer[field]}
                      onChange={(e) => setNewCustomer((n) => ({ ...n, [field]: e.target.value }))}
                      className="w-full bg-[#111111] border border-[#1f1f1f] rounded-lg px-3 py-2 text-sm text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000]"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={addCustomer}
                    disabled={!newCustomer.name}
                    className="w-full py-2 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Save Customer
                  </button>
                </div>
              )}

              {/* Address */}
              <div className="relative">
                <label className="block text-xs font-semibold text-[#f5f5f5] mb-1.5">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  onFocus={() => { if (addressSuggestions.length > 0) setShowSuggestions(true); }}
                  placeholder="123 Main St, Larose, LA"
                  autoComplete="off"
                  className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000]"
                />
                {addressLoading && (
                  <div className="absolute right-3 top-[2.1rem] w-3 h-3 border border-[#4b5563] border-t-[#c9a84c] rounded-full animate-spin" />
                )}
                {showSuggestions && addressSuggestions.length > 0 && (
                  <div className="absolute z-50 left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-xl">
                    {addressSuggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => pickSuggestion(s)}
                        className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left hover:bg-[#800000]/20 transition-colors border-b border-[#2a2a2a] last:border-0"
                      >
                        <MapPin size={12} className="text-[#800000] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[#f5f5f5] leading-relaxed">{s}</span>
                      </button>
                    ))}
                  </div>
                )}
                {form.address && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(form.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <MapPin size={11} /> Preview in Google Maps
                  </a>
                )}
              </div>

              {/* Transcript */}
              <div>
                <label className="block text-xs font-semibold text-[#f5f5f5] mb-1.5">
                  <span className="flex items-center gap-1.5"><Phone size={12} className="text-[#800000]" /> Call / Email Transcript</span>
                </label>
                <textarea
                  value={form.transcript}
                  onChange={(e) => setForm((f) => ({ ...f, transcript: e.target.value }))}
                  placeholder="Paste or type the call summary or email content here…"
                  rows={4}
                  className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] resize-none"
                />
              </div>

              {formError && <p className="text-red-400 text-xs">{formError}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Truck size={16} />
                {submitting ? 'Dispatching…' : 'Dispatch Now'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
