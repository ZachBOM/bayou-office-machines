'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, UserPlus, Pencil, Trash2, X, Check, Shield, Wrench, User } from 'lucide-react';
import Link from 'next/link';

type Account = {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

type RoleFilter = 'all' | 'admin' | 'staff' | 'customer';

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  admin:    { label: 'Admin',    color: 'text-[#c9a84c] bg-[#c9a84c]/10 border-[#c9a84c]/30', icon: <Shield size={10} /> },
  staff:    { label: 'Staff',    color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',     icon: <Wrench size={10} /> },
  customer: { label: 'Customer', color: 'text-[#9ca3af] bg-[#9ca3af]/10 border-[#9ca3af]/30', icon: <User size={10} /> },
};

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.customer;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function CreateAccountModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setErrorMsg(data.error || 'Something went wrong.');
      setStatus('error');
    } else {
      setStatus('success');
      onCreated();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-[#111111] rounded-xl border border-[#1f1f1f] overflow-hidden">
        <div className="h-1 bg-[#800000]" />
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold text-[#f5f5f5]">Create New Account</h2>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white p-1 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="px-6 pb-6">
            <p className="text-green-400 text-sm mb-4">Account created successfully!</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setStatus('idle'); setForm({ name: '', email: '', password: '', role: 'staff' }); }}
                className="flex-1 py-2.5 bg-[#111111] border border-[#1f1f1f] text-[#9ca3af] rounded-lg text-sm font-medium hover:text-white transition-colors"
              >
                Create Another
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-[#800000] hover:bg-[#600000] text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Account Type</label>
              <select
                value={form.role}
                onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] focus:outline-none focus:border-[#800000] text-sm"
              >
                <option value="staff">Staff / Field Tech</option>
                <option value="customer">Customer (customer portal)</option>
                <option value="admin">Admin (full access)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Full Name</label>
              <input
                type="text" required value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="John Smith"
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Email</label>
              <input
                type="email" required value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="john@example.com"
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Password</label>
              <input
                type="text" required value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Set a temporary password"
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] text-sm"
              />
            </div>
            {status === 'error' && <p className="text-red-400 text-sm">{errorMsg}</p>}
            <button
              type="submit" disabled={status === 'loading'}
              className="w-full py-3 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors"
            >
              {status === 'loading' ? 'Creating…' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AccountsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filter, setFilter] = useState<RoleFilter>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', role: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  const fetchAccounts = useCallback(async () => {
    const res = await fetch('/api/admin/accounts');
    const data = await res.json();
    setAccounts(data.users ?? []);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/staff-portal'); return; }
      if (session.user.user_metadata?.role !== 'admin') { router.push('/staff-portal'); return; }
      setCurrentUserId(session.user.id);
      fetchAccounts().then(() => setLoading(false));
    });
  }, [router, fetchAccounts]);

  function openEdit(acc: Account) {
    setEditId(acc.id);
    setEditForm({ name: acc.name, role: acc.role });
  }

  async function saveEdit() {
    if (!editId) return;
    setEditSaving(true);
    await fetch('/api/admin/accounts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, ...editForm }),
    });
    setEditId(null);
    setEditSaving(false);
    await fetchAccounts();
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/accounts?id=${deleteId}`, { method: 'DELETE' });
    setDeleteId(null);
    setDeleting(false);
    await fetchAccounts();
  }

  const filtered = accounts.filter(a => filter === 'all' || a.role === filter);

  const counts = {
    all: accounts.length,
    admin: accounts.filter(a => a.role === 'admin').length,
    staff: accounts.filter(a => a.role === 'staff').length,
    customer: accounts.filter(a => a.role === 'customer').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <p className="text-[#9ca3af] text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] pt-16">
      {showCreate && (
        <CreateAccountModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { fetchAccounts(); }}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm bg-[#111111] rounded-xl border border-[#1f1f1f] p-6">
            <h3 className="font-bold text-[#f5f5f5] mb-2">Delete Account?</h3>
            <p className="text-[#9ca3af] text-sm mb-6">
              This permanently deletes the account and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 bg-[#111111] border border-[#1f1f1f] text-[#9ca3af] rounded-lg text-sm font-medium hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 disabled:opacity-40 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#1f1f1f] bg-[#111111]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/staff-portal/dashboard" className="text-[#4b5563] hover:text-[#9ca3af] transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c]">Admin</p>
              <h1 className="text-lg font-bold text-[#f5f5f5]">Account Management</h1>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#800000] hover:bg-[#600000] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <UserPlus size={15} />
            <span className="hidden sm:inline">New Account</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 bg-[#111111] border border-[#1f1f1f] rounded-xl p-1 w-fit">
          {(['all', 'admin', 'staff', 'customer'] as RoleFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${
                filter === f ? 'bg-[#800000] text-white' : 'text-[#4b5563] hover:text-[#9ca3af]'
              }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-1.5 text-xs opacity-60">{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* Accounts list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#9ca3af] text-sm">No accounts found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((acc) => {
              const isEditing = editId === acc.id;
              const isCurrentUser = acc.id === currentUserId;

              return (
                <div
                  key={acc.id}
                  className={`bg-[#111111] border rounded-xl overflow-hidden transition-all ${isEditing ? 'border-[#800000]/50' : 'border-[#1f1f1f]'}`}
                >
                  {isEditing ? (
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">Edit Account</p>
                        <button onClick={() => setEditId(null)} className="text-[#4b5563] hover:text-[#9ca3af]"><X size={14} /></button>
                      </div>
                      <p className="text-xs text-[#4b5563]">{acc.email}</p>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Full name"
                        className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-[#f5f5f5] text-sm focus:outline-none focus:border-[#800000]/60"
                      />
                      <select
                        value={editForm.role}
                        onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                        disabled={isCurrentUser}
                        className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-[#f5f5f5] text-sm focus:outline-none focus:border-[#800000]/60 disabled:opacity-50"
                      >
                        <option value="admin">Admin</option>
                        <option value="staff">Staff / Field Tech</option>
                        <option value="customer">Customer</option>
                      </select>
                      {isCurrentUser && (
                        <p className="text-xs text-[#4b5563]">You cannot change your own role.</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditId(null)}
                          className="flex-1 py-2 bg-[#141414] border border-[#2a2a2a] text-[#9ca3af] rounded-lg text-sm font-medium hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          disabled={editSaving}
                          className="flex-1 py-2 bg-[#800000] hover:bg-[#600000] disabled:opacity-40 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Check size={13} /> {editSaving ? 'Saving…' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 p-4">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-[#800000]/20 border border-[#800000]/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-[#c9a84c]">
                          {(acc.name || acc.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-[#f5f5f5] truncate">
                            {acc.name || '(no name)'}
                            {isCurrentUser && <span className="ml-1 text-xs text-[#4b5563]">(you)</span>}
                          </p>
                          <RoleBadge role={acc.role} />
                        </div>
                        <p className="text-xs text-[#4b5563] truncate">{acc.email}</p>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => openEdit(acc)}
                          className="p-1.5 rounded-lg border border-[#2a2a2a] text-[#4b5563] hover:text-[#f5f5f5] hover:border-[#800000]/50 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(acc.id)}
                          disabled={isCurrentUser}
                          className="p-1.5 rounded-lg border border-[#2a2a2a] text-[#4b5563] hover:text-red-400 hover:border-red-500/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={isCurrentUser ? "Can't delete your own account" : 'Delete'}
                        >
                          <Trash2 size={13} />
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
    </div>
  );
}
