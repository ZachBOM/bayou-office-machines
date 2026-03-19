import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q');
  if (!q || q.length < 3) return NextResponse.json({ results: [] });

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=6&countrycodes=us`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'BayouOfficeMachines/1.0 (bayou-office-machines.vercel.app)',
      'Accept-Language': 'en',
    },
  });

  if (!res.ok) return NextResponse.json({ results: [] });

  const data = await res.json() as { display_name: string }[];
  const results = data.map((r) => r.display_name);
  return NextResponse.json({ results });
}
