import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import webpush from 'web-push';

export async function POST(req: NextRequest) {
  // Set VAPID details inside handler so env vars are available at runtime
  webpush.setVapidDetails(
    'mailto:zach@bayouoffice.com',
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  const body = await req.json();
  const { user_ids, title, message, url, role } = body;

  // Fetch subscriptions — by user_ids array OR by role
  let query = supabaseAdmin.from('push_subscriptions').select('*');
  if (user_ids?.length) {
    query = query.in('user_id', user_ids);
  } else if (role) {
    query = query.eq('role', role);
  }

  const { data: subs, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!subs?.length) return NextResponse.json({ sent: 0 });

  const payload = JSON.stringify({ title, body: message, url: url || '/staff-portal/dispatch' });
  let sent = 0;

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(sub.subscription, payload);
        sent++;
      } catch (err: unknown) {
        // Remove expired/invalid subscriptions
        const e = err as { statusCode?: number };
        if (e?.statusCode === 410 || e?.statusCode === 404) {
          await supabaseAdmin.from('push_subscriptions').delete().eq('id', sub.id);
        }
      }
    })
  );

  return NextResponse.json({ sent });
}
