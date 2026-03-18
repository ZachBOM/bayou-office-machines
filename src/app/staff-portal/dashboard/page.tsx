'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import {
  Users,
  Wrench,
  ClipboardList,
  LogOut,
  Bell,
  Settings,
  UserPlus,
  X,
  Clock,
} from 'lucide-react';

function CreateAccountModal({ onClose }: { onClose: () => void }) {
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
      setForm({ name: '', email: '', password: '', role: 'staff' });
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
            <button
              onClick={() => setStatus('idle')}
              className="w-full py-2.5 bg-[#800000] hover:bg-[#600000] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Create Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Account Type</label>
              <select
                value={form.role}
                onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] focus:outline-none focus:border-[#800000] text-sm"
              >
                <option value="staff">Staff / Field Tech (clock in/out only)</option>
                <option value="customer">Customer (customer portal access)</option>
                <option value="admin">Admin (full access)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="John Smith"
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="john@example.com"
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Password</label>
              <input
                type="text"
                required
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Set a temporary password"
                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] text-sm"
              />
            </div>
            {status === 'error' && <p className="text-red-400 text-sm">{errorMsg}</p>}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors"
            >
              {status === 'loading' ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/staff-portal'); return; }
      const role = session.user.user_metadata?.role;
      if (role !== 'admin') { router.push('/staff-portal'); return; }
      setUser(session.user);
      setLoading(false);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/staff-portal');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#9ca3af] text-sm">Loading...</div>
      </div>
    );
  }

  const name = user?.user_metadata?.name || user?.email;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16">
      {showCreate && <CreateAccountModal onClose={() => setShowCreate(false)} />}

      {/* Top bar */}
      <div className="border-b border-[#1f1f1f] bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c]">Admin</p>
            <h1 className="text-xl font-bold text-[#f5f5f5]">Welcome back, {name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/staff-portal/clock"
              className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#1f1f1f] hover:border-[#800000]/40 text-[#9ca3af] hover:text-[#f5f5f5] rounded-lg text-sm font-medium transition-colors"
            >
              <Clock size={14} />
              Clock In/Out
            </Link>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#800000] hover:bg-[#600000] text-white rounded-lg text-sm font-medium transition-colors"
            >
              <UserPlus size={14} />
              New Account
            </button>
            <button className="w-9 h-9 rounded-lg bg-[#111111] border border-[#1f1f1f] flex items-center justify-center text-[#9ca3af] hover:text-[#f5f5f5] hover:border-[#800000]/40 transition-colors">
              <Bell size={16} />
            </button>
            <button className="w-9 h-9 rounded-lg bg-[#111111] border border-[#1f1f1f] flex items-center justify-center text-[#9ca3af] hover:text-[#f5f5f5] hover:border-[#800000]/40 transition-colors">
              <Settings size={16} />
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#1f1f1f] hover:border-[#800000]/40 text-[#9ca3af] hover:text-[#f5f5f5] rounded-lg text-sm font-medium transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard icon={<Users size={20} />} label="Contract Customers" value="—" note="Coming soon" />
          <StatCard icon={<Wrench size={20} />} label="Open Service Calls" value="—" note="Coming soon" />
          <StatCard icon={<ClipboardList size={20} />} label="Pending Approvals" value="—" note="Coming soon" />
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashSection title="Service Calls" description="View and manage incoming service calls, assign techs, and track status." badge="Coming Soon" />
          <DashSection title="Customer Accounts" description="Approve or deny customer portal sign-up requests and manage accounts." badge="Coming Soon" />
          <DashSection title="CRM — Customer List" description="Browse all ~200 contract customers, their machines, and service history." badge="Coming Soon" />
          <DashSection title="Dispatch Map" description="Live map showing all active tech locations during dispatched jobs." badge="Coming Soon" />
          <DashSection title="Time & Attendance" description="View clock in/out records and hours worked for all staff members." badge="Coming Soon" href="/staff-portal/timesheet" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[#800000]">{icon}</span>
        <span className="text-xs text-[#4b5563] font-medium">{note}</span>
      </div>
      <p className="text-2xl font-bold text-[#f5f5f5] mb-1">{value}</p>
      <p className="text-sm text-[#9ca3af]">{label}</p>
    </div>
  );
}

function DashSection({ title, description, badge, href }: { title: string; description: string; badge: string; href?: string }) {
  const inner = (
    <>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-[#f5f5f5]">{title}</h3>
        <span className={`text-xs border rounded-full px-2.5 py-0.5 font-medium ${href ? 'bg-[#800000]/20 text-white border-[#800000]/40' : 'bg-[#800000]/10 text-[#c9a84c] border-[#800000]/20'}`}>
          {href ? 'Open →' : badge}
        </span>
      </div>
      <p className="text-sm text-[#9ca3af] leading-relaxed">{description}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="bg-[#111111] border border-[#1f1f1f] hover:border-[#800000]/40 rounded-xl p-6 block transition-colors">
        {inner}
      </Link>
    );
  }

  return <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">{inner}</div>;
}
