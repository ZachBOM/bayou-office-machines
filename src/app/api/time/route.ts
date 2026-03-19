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
