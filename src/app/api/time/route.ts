import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  const { user_id, action } = await req.json();

  if (!user_id || !action) {
    return NextResponse.json({ error: 'Missing fields.' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('time_entries')
    .insert({ user_id, action });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');
  const from = searchParams.get('from');

  const limit = parseInt(searchParams.get('limit') || '10');

  const query = supabaseAdmin
    .from('time_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (user_id) query.eq('user_id', user_id);
  if (from) query.gte('created_at', from);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entries: data });
}

export async function PATCH(req: NextRequest) {
  const { id, action, created_at } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const updates: Record<string, string> = {};
  if (action) updates.action = action;
  if (created_at) updates.created_at = created_at;
  const { error } = await supabaseAdmin.from('time_entries').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const { error } = await supabaseAdmin.from('time_entries').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  // Add a manual entry (admin use)
  const { user_id, action, created_at } = await req.json();
  if (!user_id || !action || !created_at) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const { error } = await supabaseAdmin.from('time_entries').insert({ user_id, action, created_at });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
