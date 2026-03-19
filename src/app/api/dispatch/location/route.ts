import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { dispatch_id, tech_id, lat, lng } = body;
  if (!dispatch_id || !tech_id || lat == null || lng == null) {
    return NextResponse.json({ error: 'dispatch_id, tech_id, lat, lng required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('dispatch_locations')
    .insert({ dispatch_id, tech_id, lat, lng });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// Returns the latest location for each active dispatch
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dispatchId = searchParams.get('dispatch_id');

  let query = supabaseAdmin
    .from('dispatch_locations')
    .select('*')
    .order('created_at', { ascending: false });

  if (dispatchId) {
    query = query.eq('dispatch_id', dispatchId).limit(1);
  } else {
    query = query.limit(100);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return latest per dispatch_id
  const latest: Record<string, typeof data[0]> = {};
  for (const loc of data ?? []) {
    if (!latest[loc.dispatch_id]) latest[loc.dispatch_id] = loc;
  }

  return NextResponse.json({ locations: Object.values(latest) });
}
