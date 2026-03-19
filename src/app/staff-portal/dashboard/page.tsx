'use client';

import { useEffect, useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Wrench,
  ClipboardList,
  LogOut,
  Bell,
  UserPlus,
  X,
  Clock,
  Menu,
  Newspaper,
  ImageIcon,
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
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] focus:outline-none focus:border-[#800000] text-sm"
              >
                <option value="staff">Staff / Field Tech</option>
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
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] text-sm"
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
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] text-sm"
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
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] text-sm"
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

function NewArticleModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setStatus('loading');

    let image_url: string | null = null;

    // Upload image to Supabase storage if provided
    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, imageFile);
      if (uploadError) {
        setErrorMsg('Image upload failed: ' + uploadError.message);
        setStatus('error');
        return;
      }
      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName);
      image_url = publicUrl;
    }

    const res = await fetch('/api/admin/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, image_url }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErrorMsg(data.error || 'Something went wrong.');
      setStatus('error');
    } else {
      setStatus('success');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 overflow-y-auto py-8">
      <div className="w-full max-w-lg bg-[#111111] rounded-xl border border-[#1f1f1f] overflow-hidden my-auto">
        <div className="h-1 bg-[#800000]" />
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold text-[#f5f5f5]">New Article</h2>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white p-1 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="px-6 pb-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Newspaper size={22} className="text-green-400" />
            </div>
            <p className="text-green-400 font-semibold mb-1">Article Published!</p>
            <p className="text-[#9ca3af] text-sm mb-6">It&apos;s now live on the Articles page.</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setTitle(''); setBody(''); setImageFile(null); setImagePreview(null); setStatus('idle'); }}
                className="flex-1 py-2.5 bg-[#111111] border border-[#1f1f1f] text-[#9ca3af] rounded-lg text-sm font-medium hover:text-white transition-colors"
              >
                Write Another
              </button>
              <Link
                href="/articles"
                target="_blank"
                className="flex-1 py-2.5 bg-[#800000] hover:bg-[#600000] text-white rounded-lg text-sm font-semibold transition-colors text-center"
              >
                View Articles
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">

            {/* Header / Title */}
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Header (Title)</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Tips for Getting the Most Out of Your Toshiba Copier"
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] text-sm"
              />
            </div>

            {/* Main Picture */}
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Main Picture</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer border border-dashed border-[#2a2a2a] hover:border-[#800000]/50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 transition-colors"
              >
                {imagePreview ? (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#2a2a2a] flex items-center justify-center">
                      <ImageIcon size={18} className="text-[#4b5563]" />
                    </div>
                    <p className="text-sm text-[#9ca3af]">Click to upload an image</p>
                    <p className="text-xs text-[#4b5563]">JPG, PNG, WebP — recommended 1200×630</p>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                  className="mt-2 text-xs text-[#4b5563] hover:text-[#9ca3af] transition-colors"
                >
                  Remove image
                </button>
              )}
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Body</label>
              <textarea
                required
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Write your article here. Press Enter for new paragraphs."
                rows={8}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] text-sm resize-none leading-relaxed"
              />
            </div>

            {status === 'error' && <p className="text-red-400 text-sm">{errorMsg}</p>}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors"
            >
              {status === 'loading' ? 'Publishing...' : 'Publish Article'}
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
  const [showArticle, setShowArticle] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-[#9ca3af] text-sm">Loading...</div>
      </div>
    );
  }

  const name = user?.user_metadata?.name || user?.email;

  return (
    <div className="min-h-screen bg-[#141414] pt-16">
      {showCreate && <CreateAccountModal onClose={() => setShowCreate(false)} />}
      {showArticle && <NewArticleModal onClose={() => setShowArticle(false)} />}

      {/* Top bar */}
      <div className="border-b border-[#1f1f1f] bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c]">Admin</p>
            <h1 className="text-lg sm:text-xl font-bold text-[#f5f5f5]">Welcome back, {name}</h1>
          </div>

          {/* Desktop buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/staff-portal/clock"
              className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#1f1f1f] hover:border-[#800000]/40 text-[#9ca3af] hover:text-[#f5f5f5] rounded-lg text-sm font-medium transition-colors"
            >
              <Clock size={14} />
              Staff Portal
            </Link>
            <button
              onClick={() => setShowArticle(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#1f1f1f] hover:border-[#800000]/40 text-[#9ca3af] hover:text-[#f5f5f5] rounded-lg text-sm font-medium transition-colors"
            >
              <Newspaper size={14} />
              New Article
            </button>
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
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#1f1f1f] hover:border-[#800000]/40 text-[#9ca3af] hover:text-[#f5f5f5] rounded-lg text-sm font-medium transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(p => !p)}
            className="sm:hidden w-9 h-9 rounded-lg bg-[#111111] border border-[#1f1f1f] flex items-center justify-center text-[#9ca3af]"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-[#1f1f1f] px-4 py-3 space-y-2">
            <button
              onClick={() => { setShowCreate(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#800000] hover:bg-[#600000] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <UserPlus size={16} />
              Create New Account
            </button>
            <button
              onClick={() => { setShowArticle(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#111111] border border-[#1f1f1f] text-[#9ca3af] rounded-lg text-sm font-medium transition-colors"
            >
              <Newspaper size={16} />
              New Article
            </button>
            <Link
              href="/staff-portal/clock"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 bg-[#111111] border border-[#1f1f1f] text-[#9ca3af] rounded-lg text-sm font-medium transition-colors"
            >
              <Clock size={16} />
              Staff Portal
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#111111] border border-[#1f1f1f] text-[#9ca3af] rounded-lg text-sm font-medium transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard icon={<Users size={20} />} label="Contract Customers" value="—" note="Coming soon" />
          <StatCard icon={<Wrench size={20} />} label="Open Service Calls" value="—" note="Coming soon" />
          <StatCard icon={<ClipboardList size={20} />} label="Pending Approvals" value="—" note="Coming soon" />
        </div>

        {/* Preview views */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#4b5563] mb-3">Preview As</p>
          <div className="flex gap-3">
            <Link
              href="/staff-portal/clock?preview=true"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] border border-[#1f1f1f] hover:border-[#800000]/40 rounded-lg text-sm text-[#9ca3af] hover:text-[#f5f5f5] transition-colors"
            >
              👷 Staff / Field Tech (Preview)
            </Link>
            <Link
              href="/customer-portal/dashboard"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] border border-[#1f1f1f] hover:border-[#800000]/40 rounded-lg text-sm text-[#9ca3af] hover:text-[#f5f5f5] transition-colors"
            >
              🏢 Customer Portal
            </Link>
          </div>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashSection title="Service Calls" description="View and manage incoming service calls, assign techs, and track status." badge="Coming Soon" />
          <DashSection title="Customer Accounts" description="Approve or deny customer portal sign-up requests and manage accounts." badge="Coming Soon" />
          <DashSection title="CRM — Customer List" description="Browse and manage all customers — name, phone, email, address, printer type, and status." badge="Open" href="/staff-portal/crm" buttonLabel="Open CRM →" />
          <DashSection title="Dispatch" description="Dispatch techs to jobs, track their location in real time, and monitor travel and on-site timers." badge="Open" href="/staff-portal/dispatch" buttonLabel="Open Dispatch Board →" />
          <DashSection title="Time & Attendance" description="View all staff timesheets, print payroll reports, and reset pay periods." badge="Open" href="/staff-portal/timesheets" />
          <DashSection title="Articles" description="Write and publish articles, tips, and news to the public website." badge="Open" href="/articles" buttonLabel="View Articles →" onAction={() => setShowArticle(true)} actionLabel="+ New Article" />
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

function DashSection({ title, description, badge, href, onAction, actionLabel }: {
  title: string;
  description: string;
  badge: string;
  href?: string;
  onAction?: () => void;
  actionLabel?: string;
  buttonLabel?: string;
}) {
  return (
    <div className={`bg-[#111111] border border-[#1f1f1f] rounded-xl p-6 ${href ? 'hover:border-[#800000]/40 transition-colors' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-[#f5f5f5]">{title}</h3>
        <span className={`text-xs border rounded-full px-2.5 py-0.5 font-medium ${href || onAction ? 'bg-[#800000]/20 text-white border-[#800000]/40' : 'bg-[#800000]/10 text-[#c9a84c] border-[#800000]/20'}`}>
          {href || onAction ? 'Open' : badge}
        </span>
      </div>
      <p className="text-sm text-[#9ca3af] leading-relaxed mb-4">{description}</p>
      {(href || onAction) && (
        <div className="flex gap-2">
          {href && (
            <Link href={href} className="text-xs font-semibold text-[#800000] hover:text-[#a00000] transition-colors">
              View →
            </Link>
          )}
          {onAction && actionLabel && (
            <button onClick={onAction} className="text-xs font-semibold text-[#c9a84c] hover:text-white transition-colors ml-3">
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
