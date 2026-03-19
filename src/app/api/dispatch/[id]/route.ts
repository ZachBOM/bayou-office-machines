import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  const updates: Record<string, unknown> = { status };

  if (status === 'en_route') {
    // travel timer starts (dispatched_at already set), just update status
  } else if (status === 'on_site') {
    updates.arrived_at = new Date().toISOString();
  } else if (status === 'completed') {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from('dispatches')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dispatch: data });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from('dispatches')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dispatch: data });
}
