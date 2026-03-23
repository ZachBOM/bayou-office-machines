import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, company, phone, email, model, supplyType, qty, notes } = await req.json();

  if (!name || !company || !phone || !supplyType) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: 'Bayou Office Machines Website <onboarding@resend.dev>',
    to: 'sales@bayouoffice.com',
    subject: `Supply Order Request — ${company}`,
    html: `
      <h2>Supply Order Request</h2>
      <p><strong>Customer Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
      <hr/>
      ${model ? `<p><strong>Machine Model:</strong> ${model}</p>` : ''}
      <p><strong>Supply Needed:</strong> ${supplyType}</p>
      ${qty ? `<p><strong>Quantity:</strong> ${qty}</p>` : ''}
      ${notes ? `<p><strong>Additional Notes:</strong> ${notes}</p>` : ''}
      <hr/>
      <p style="color:#888;font-size:12px;">Submitted via bayouoffice.com supply order form</p>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
