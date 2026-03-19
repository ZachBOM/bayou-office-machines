import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, subscription, role } = body;
  if (!user_id || !subscription) {
    return NextResponse.json({ error: 'user_id and subscription required' }, { status: 400 });
  }

  // Upsert — one subscription per user
  const { error } = await supabaseAdmin
    .from('push_subscriptions')
    .upsert({ user_id, subscription, role }, { onConflict: 'user_id' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
