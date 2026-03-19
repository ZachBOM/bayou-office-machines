import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const status = searchParams.get('status');

  let query = supabaseAdmin
    .from('customers')
    .select('*')
    .order('name');

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ customers: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, company, phone, email, address, notes, printer_type, status } = body;
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('customers')
    .insert({ name, company, phone, email, address, notes, printer_type, status: status ?? 'active' })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ customer: data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('customers')
    .update(fields)
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ customer: data });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { error } = await supabaseAdmin
    .from('customers')
    .update({ active: false })
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
