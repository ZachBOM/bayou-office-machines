import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, company, phone, email, model, serial, bwReading, colorReading, notes } = await req.json();

  if (!name || !company || !phone || !bwReading) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: 'Bayou Office Machines Website <onboarding@resend.dev>',
    to: 'sales@bayouoffice.com',
    subject: `Meter Read Submission — ${company}`,
    html: `
      <h2>Meter Read Submission</h2>
      <p><strong>Customer Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
      <hr/>
      ${model ? `<p><strong>Machine Model:</strong> ${model}</p>` : ''}
      ${serial ? `<p><strong>Serial Number:</strong> ${serial}</p>` : ''}
      <p><strong>B&amp;W Meter Reading:</strong> ${bwReading}</p>
      ${colorReading ? `<p><strong>Color Meter Reading:</strong> ${colorReading}</p>` : ''}
      ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
      <hr/>
      <p style="color:#888;font-size:12px;">Submitted via bayouoffice.com meter read form</p>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
