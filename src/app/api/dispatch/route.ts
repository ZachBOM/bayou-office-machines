import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status'); // active | all | completed
  const techId = searchParams.get('tech_id');

  let query = supabaseAdmin
    .from('dispatches')
    .select('*')
    .order('created_at', { ascending: false });

  if (status === 'active') {
    query = query.in('status', ['pending', 'en_route', 'on_site']);
  } else if (status === 'completed') {
    query = query.in('status', ['completed', 'cancelled']);
  }

  if (techId) query = query.eq('tech_id', techId);

  const { data, error } = await query.limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dispatches: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tech_id, tech_name, customer_id, customer_name, address, transcript, dispatched_by, dispatched_by_name } = body;
  if (!tech_id) return NextResponse.json({ error: 'tech_id is required' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('dispatches')
    .insert({
      tech_id,
      tech_name,
      customer_id,
      customer_name,
      address,
      transcript,
      dispatched_by,
      dispatched_by_name,
      status: 'pending',
      dispatched_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dispatch: data });
}
