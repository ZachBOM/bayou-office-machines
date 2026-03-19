import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const staff = (data.users ?? [])
    .filter((u) => ['admin', 'staff'].includes(u.user_metadata?.role ?? ''))
    .map((u) => ({
      id: u.id,
      name: u.user_metadata?.name ?? u.email ?? u.id,
      email: u.email ?? '',
      role: u.user_metadata?.role ?? '',
    }));

  return NextResponse.json({ users: staff });
}
