import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  // Get all users
  const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
  if (usersError) return NextResponse.json({ error: usersError.message }, { status: 500 });

  // Get time entries in range
  let query = supabaseAdmin
    .from('time_entries')
    .select('*')
    .order('created_at', { ascending: true });

  if (from) query = query.gte('created_at', from);
  if (to) query = query.lte('created_at', to);

  const { data: entries, error: entriesError } = await query;
  if (entriesError) return NextResponse.json({ error: entriesError.message }, { status: 500 });

  // Staff/admin users only
  const staffUsers = users.filter(u => {
    const role = u.user_metadata?.role;
    return role === 'staff' || role === 'admin';
  });

  // Group entries by user
  const byUser = staffUsers.map(u => ({
    id: u.id,
    name: u.user_metadata?.name || u.email || u.id,
    email: u.email,
    role: u.user_metadata?.role,
    entries: (entries || []).filter(e => e.user_id === u.id),
  })).filter(u => u.entries.length > 0);

  return NextResponse.json({ users: byUser });
}
