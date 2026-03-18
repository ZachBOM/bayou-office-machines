'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import {
  Users,
  Wrench,
  ClipboardList,
  LogOut,
  Bell,
  Settings,
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/staff-portal');
        return;
      }
      const role = session.user.user_metadata?.role;
      if (role !== 'admin' && role !== 'staff') {
        router.push('/staff-portal');
        return;
      }
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
  const role = user?.user_metadata?.role;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16">
      {/* Top bar */}
      <div className="border-b border-[#1f1f1f] bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c]">
              {role === 'admin' ? 'Admin' : 'Staff'}
            </p>
            <h1 className="text-xl font-bold text-[#f5f5f5]">Welcome back, {name}</h1>
          </div>
          <div className="flex items-center gap-3">
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
          <DashSection
            title="Service Calls"
            description="View and manage incoming service calls, assign techs, and track status."
            badge="Coming Soon"
          />
          <DashSection
            title="Customer Accounts"
            description="Approve or deny customer portal sign-up requests and manage accounts."
            badge="Coming Soon"
          />
          <DashSection
            title="CRM — Customer List"
            description="Browse all ~200 contract customers, their machines, and service history."
            badge="Coming Soon"
          />
          <DashSection
            title="Dispatch Map"
            description="Live map showing all active tech locations during dispatched jobs."
            badge="Coming Soon"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
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

function DashSection({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-[#f5f5f5]">{title}</h3>
        <span className="text-xs bg-[#800000]/10 text-[#c9a84c] border border-[#800000]/20 rounded-full px-2.5 py-0.5 font-medium">
          {badge}
        </span>
      </div>
      <p className="text-sm text-[#9ca3af] leading-relaxed">{description}</p>
    </div>
  );
}
