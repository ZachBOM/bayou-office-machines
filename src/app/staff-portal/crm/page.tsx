'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Search, X, Phone, Mail, MapPin,
  Printer, Edit2, Trash2, ChevronDown, ChevronUp, Users,
} from 'lucide-react';

interface Customer {
  id: string;
  created_at: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  printer_type: string;
  status: string;
  active: boolean;
}

const STATUSES = ['active', 'inactive', 'prospect', 'contract'] as const;
type CustomerStatus = typeof STATUSES[number];

const STATUS_STYLE: Record<string, string> = {
  active:   'bg-green-500/10 border-green-500/30 text-green-400',
  inactive: 'bg-[#9ca3af]/10 border-[#9ca3af]/30 text-[#9ca3af]',
  prospect: 'bg-blue-400/10 border-blue-400/30 text-blue-400',
  contract: 'bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]',
};

const EMPTY_FORM = {
  name: '', company: '', phone: '', email: '',
  address: '', printer_type: '', notes: '', status: 'active' as CustomerStatus,
};

export default function CRMPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(async (q?: string, s?: string) => {
    const params = new URLSearchParams();
    if (q) params.set('search', q);
    if (s && s !== 'all') params.set('status', s);
    const res = await fetch(`/api/customers?${params}`);
    const data = await res.json();
    setCustomers(data.customers ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/staff-portal'); return; }
      const role = session.user.user_metadata?.role;
      if (role !== 'admin' && role !== 'staff') { router.push('/staff-portal'); return; }
      load();
    });
  }, [router, load]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => load(search, filterStatus), 300);
    return () => clearTimeout(t);
  }, [search, filterStatus, load]);

  function openAdd() {
    setEditCustomer(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  }

  function openEdit(c: Customer) {
    setEditCustomer(c);
    setForm({
      name: c.name ?? '',
      company: c.company ?? '',
      phone: c.phone ?? '',
      email: c.email ?? '',
      address: c.address ?? '',
      printer_type: c.printer_type ?? '',
      notes: c.notes ?? '',
      status: (c.status as CustomerStatus) ?? 'active',
    });
    setFormError('');
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Name is required.'); return; }
    setSaving(true);
    setFormError('');

    const res = await fetch('/api/customers', {
      method: editCustomer ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editCustomer ? { id: editCustomer.id, ...form } : form),
    });
    const data = await res.json();

    if (!res.ok) {
      setFormError(data.error ?? 'Something went wrong.');
    } else {
      setShowModal(false);
      await load(search, filterStatus);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Archive this customer?')) return;
    await fetch(`/api/customers?id=${id}`, { method: 'DELETE' });
    await load(search, filterStatus);
  }

  const counts = {
    all: customers.length,
    active: customers.filter((c) => c.status === 'active').length,
    contract: customers.filter((c) => c.status === 'contract').length,
    prospect: customers.filter((c) => c.status === 'prospect').length,
    inactive: customers.filter((c) => c.status === 'inactive').length,
  };

  return (
    <div className="min-h-screen bg-[#141414] pt-16">
      {/* Header */}
      <div className="border-b border-[#1f1f1f] bg-[#111111]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/staff-portal/dashboard" className="text-[#4b5563] hover:text-[#9ca3af] transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[#f5f5f5]">CRM</h1>
              <p className="text-xs text-[#4b5563]">{counts.all} customer{counts.all !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#800000] hover:bg-[#600000] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Customer</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['active', 'contract', 'prospect', 'inactive'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
              className={`rounded-xl p-3 border text-left transition-all ${
                filterStatus === s
                  ? STATUS_STYLE[s]
                  : 'bg-[#111111] border-[#1f1f1f] hover:border-[#2a2a2a]'
              }`}
            >
              <p className="text-2xl font-extrabold text-[#f5f5f5] tabular-nums">{counts[s]}</p>
              <p className="text-xs capitalize mt-0.5 text-[#9ca3af]">{s}</p>
            </button>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
            <input
              type="text"
              placeholder="Search by name, company, email, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111111] border border-[#1f1f1f] rounded-xl pl-8 pr-4 py-2.5 text-sm text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4b5563] hover:text-[#9ca3af]">
                <X size={14} />
              </button>
            )}
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#111111] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] focus:outline-none focus:border-[#800000] transition-colors"
          >
            <option value="all">All Status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        {/* Customer list */}
        {loading ? (
          <div className="text-center py-16 text-[#4b5563] text-sm">Loading…</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#111111] border border-[#1f1f1f] flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-[#800000]" />
            </div>
            <p className="text-[#f5f5f5] font-semibold mb-1">{search ? 'No results' : 'No customers yet'}</p>
            <p className="text-[#4b5563] text-sm">{search ? 'Try a different search.' : 'Add your first customer to get started.'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {customers.map((c) => {
              const isExpanded = expandedId === c.id;
              return (
                <div key={c.id} className="bg-[#111111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
                  {/* Row */}
                  <div
                    className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : c.id)}
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-[#800000]/20 border border-[#800000]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[#800000]">{(c.name ?? '?')[0].toUpperCase()}</span>
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#f5f5f5] truncate">{c.name}</span>
                        {c.company && <span className="text-xs text-[#4b5563] truncate">{c.company}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        {c.phone && <span className="text-xs text-[#9ca3af]">{c.phone}</span>}
                        {c.printer_type && (
                          <span className="flex items-center gap-1 text-xs text-[#9ca3af]">
                            <Printer size={10} className="text-[#4b5563]" />
                            {c.printer_type}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status badge */}
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${STATUS_STYLE[c.status] ?? STATUS_STYLE.inactive}`}>
                      {c.status ?? 'unknown'}
                    </span>

                    {/* Expand chevron */}
                    <span className="text-[#4b5563] flex-shrink-0">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-[#1a1a1a] px-4 py-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {c.email && (
                          <a href={`mailto:${c.email}`} className="flex items-center gap-2.5 group">
                            <Mail size={14} className="text-[#800000] flex-shrink-0" />
                            <span className="text-sm text-[#9ca3af] group-hover:text-[#f5f5f5] transition-colors truncate">{c.email}</span>
                          </a>
                        )}
                        {c.phone && (
                          <a href={`tel:${c.phone}`} className="flex items-center gap-2.5 group">
                            <Phone size={14} className="text-[#800000] flex-shrink-0" />
                            <span className="text-sm text-[#9ca3af] group-hover:text-[#f5f5f5] transition-colors">{c.phone}</span>
                          </a>
                        )}
                        {c.address && (
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(c.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-2.5 group sm:col-span-2"
                          >
                            <MapPin size={14} className="text-[#800000] flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-[#9ca3af] group-hover:text-[#f5f5f5] transition-colors">{c.address}</span>
                          </a>
                        )}
                        {c.printer_type && (
                          <div className="flex items-center gap-2.5">
                            <Printer size={14} className="text-[#800000] flex-shrink-0" />
                            <span className="text-sm text-[#9ca3af]">{c.printer_type}</span>
                          </div>
                        )}
                      </div>

                      {c.notes && (
                        <div className="bg-[#141414] rounded-xl p-3 border border-[#1f1f1f]">
                          <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-1.5">Notes</p>
                          <p className="text-sm text-[#9ca3af] leading-relaxed whitespace-pre-wrap">{c.notes}</p>
                        </div>
                      )}

                      <p className="text-xs text-[#2a2a2a]">
                        Added {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#f5f5f5] bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-lg transition-colors"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={12} /> Archive
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ───────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-4 pb-4 sm:pb-0">
          <div className="w-full max-w-md bg-[#111111] rounded-2xl border border-[#1f1f1f] overflow-hidden max-h-[92vh] flex flex-col">
            <div className="h-1 bg-[#800000]" />
            <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
              <h2 className="font-bold text-[#f5f5f5]">{editCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#4b5563] hover:text-[#9ca3af] p-1"><X size={16} /></button>
            </div>

            <form onSubmit={handleSave} className="px-5 pb-5 overflow-y-auto space-y-3">
              {/* Name + Company */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-[#f5f5f5] mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="John Smith"
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-[#f5f5f5] mb-1">Company</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    placeholder="Acme Corp"
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000]"
                  />
                </div>
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#f5f5f5] mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="985-000-0000"
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#f5f5f5] mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="john@company.com"
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000]"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-[#f5f5f5] mb-1">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="123 Main St, Larose, LA 70373"
                  className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000]"
                />
              </div>

              {/* Printer Type + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#f5f5f5] mb-1">Printer / Machine</label>
                  <input
                    type="text"
                    value={form.printer_type}
                    onChange={(e) => setForm((f) => ({ ...f, printer_type: e.target.value }))}
                    placeholder="Toshiba e-STUDIO 5015AC"
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#f5f5f5] mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as CustomerStatus }))}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] focus:outline-none focus:border-[#800000]"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#f5f5f5] mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Service history, special instructions, contract details…"
                  rows={3}
                  className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] resize-none"
                />
              </div>

              {formError && <p className="text-red-400 text-xs">{formError}</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors"
              >
                {saving ? 'Saving…' : editCustomer ? 'Save Changes' : 'Add Customer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
