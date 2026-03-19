import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('*')
    .eq('active', true)
    .order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ customers: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, company, phone, email, address, notes } = body;
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  const { data, error } = await supabaseAdmin
    .from('customers')
    .insert({ name, company, phone, email, address, notes })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ customer: data });
}
