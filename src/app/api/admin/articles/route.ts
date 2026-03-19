import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  const { title, body, image_url } = await req.json();

  if (!title || !body) {
    return NextResponse.json({ error: 'Title and body are required.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('articles')
    .insert({ title, body, image_url: image_url || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ article: data });
}
