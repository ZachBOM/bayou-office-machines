'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import {
  Wrench,
  Printer,
  ClipboardList,
  TrendingUp,
  LogOut,
  ChevronDown,
} from 'lucide-react';

const navSections = [
  {
    label: 'Service Calls',
    icon: <Wrench size={16} />,
    items: ['Submit a Service Call', 'My Open Calls', 'Service History'],
  },
  {
    label: 'My Equipment',
    icon: <Printer size={16} />,
    items: ['View My Machines', 'Supplies & Toner'],
  },
  {
    label: 'Requests',
    icon: <ClipboardList size={16} />,
    items: ['Request an Upgrade', 'Request a Quote'],
  },
  {
    label: 'Account',
    icon: <TrendingUp size={16} />,
    items: ['Account Info', 'Contact Support'],
  },
];

function SidebarSection({
  label,
  icon,
  items,
}: {
  label: string;
  icon: React.ReactNode;
  items: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group"
      >
        <div className="flex items-center gap-3 text-white/80 group-hover:text-white text-sm font-medium">
          {icon}
          {label}
        </div>
        <ChevronDown
          size={14}
          className={`text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-0.5">
          {items.map((item) => (
            <button
              key={item}
              className="w-full text-left px-4 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-between group"
            >
              {item}
              <span className="text-[10px] bg-white/10 text-white/40 rounded px-1.5 py-0.5 font-medium group-hover:bg-white/20">
                Soon
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [msgStatus, setMsgStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/customer-portal');
        return;
      }
      const role = session.user.user_metadata?.role;
      if (role === 'staff') {
        router.push('/customer-portal');
        return;
      }
      setUser(session.user);
      setLoading(false);
    });
  }, [router]);

  async function handleSendMessage(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setMsgStatus('loading');
    const name = user?.user_metadata?.name || user?.email || 'Customer';
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email: user?.email, message }),
    });
    if (res.ok) {
      setMsgStatus('success');
      setMessage('');
    } else {
      setMsgStatus('error');
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/customer-portal');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-[#9ca3af] text-sm">Loading...</div>
      </div>
    );
  }

  const email = user?.email;
  const isAdminPreview = user?.user_metadata?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col pt-16 md:pt-[100px]">
      {isAdminPreview && (
        <div className="bg-[#c9a84c]/10 border-b border-[#c9a84c]/30 px-6 py-2 flex items-center justify-between">
          <p className="text-[#c9a84c] text-xs font-semibold">Admin Preview — viewing as customer</p>
          <Link href="/staff-portal/dashboard" className="text-xs text-[#c9a84c] hover:underline font-medium">← Back to Dashboard</Link>
        </div>
      )}
    <div className="flex-1 flex">
      {/* Maroon sidebar */}
      <div className="w-64 flex-shrink-0 bg-[#800000] flex flex-col min-h-full">
        <div className="p-6 border-b border-white/10">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">Customer Portal</p>
          <p className="text-white font-semibold text-sm truncate">{email}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navSections.map((section) => (
            <SidebarSection
              key={section.label}
              label={section.label}
              icon={section.icon}
              items={section.items}
            />
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10">
        <h1 className="text-2xl font-extrabold text-[#f5f5f5] mb-2">Welcome back</h1>
        <p className="text-[#9ca3af] text-sm mb-10">
          Your customer portal is being set up. Features will appear here as they go live.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Open Service Calls', value: '—' },
            { label: 'Machines on Contract', value: '—' },
            { label: 'Last Service', value: '—' },
          ].map((card) => (
            <div key={card.label} className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
              <p className="text-[#9ca3af] text-sm mb-2">{card.label}</p>
              <p className="text-2xl font-bold text-[#f5f5f5]">{card.value}</p>
              <p className="text-xs text-[#4b5563] mt-1">Coming soon</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-[#111111] border border-[#800000]/30 rounded-xl p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-2">Need Help Now?</p>
          <p className="text-[#f5f5f5] font-semibold mb-1">Call us directly</p>
          <a href="tel:9856937811" className="text-[#800000] hover:underline font-medium">
            985-693-7811
          </a>
        </div>

        {/* Send Message */}
        <div className="mt-6 bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#4b5563] mb-1">Send a Message</p>
          <p className="text-[#9ca3af] text-sm mb-4">Goes directly to our team at sales@bayouoffice.com</p>
          {msgStatus === 'success' ? (
            <div className="text-center py-4">
              <p className="text-green-400 font-semibold mb-1">Message sent!</p>
              <p className="text-[#9ca3af] text-sm mb-3">We&apos;ll get back to you shortly.</p>
              <button onClick={() => setMsgStatus('idle')} className="text-sm text-[#800000] hover:underline">Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you?"
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] text-sm resize-none"
              />
              {msgStatus === 'error' && <p className="text-red-400 text-sm">Failed to send. Please call us at 985-693-7811.</p>}
              <button
                type="submit"
                disabled={msgStatus === 'loading'}
                className="w-full py-3 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors"
              >
                {msgStatus === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
