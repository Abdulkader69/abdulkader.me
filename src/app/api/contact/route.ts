import { Resend } from 'resend';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message, botField } = body;

    // Honeypot anti-spam trap
    if (botField) {
      return Response.json({ success: true }, { status: 200 });
    }

    if (
      !name?.trim() ||
      !email?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return Response.json(
        {
          error:
            'Please fill in all required fields (Name, Email, Subject, Message).',
        },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return Response.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === 're_your_api_key_here') {
      return Response.json(
        {
          error:
            'Resend API key is not configured. Please add RESEND_API_KEY to your .env.local file.',
        },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);
    const toEmail = process.env.CONTACT_TO_EMAIL || 'abdulkaderyt@gmail.com';
    // 'onboarding@resend.dev' works immediately for free without domain verification
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL ||
      'Portfolio Contact <onboarding@resend.dev>';

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: `${cleanName} <${cleanEmail}>`,
      subject: `[Portfolio Inquiry] ${cleanSubject}`,
      text: `From: ${cleanName} (${cleanEmail})\nSubject: ${cleanSubject}\n\nMessage:\n${cleanMessage}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 12px;">New Contact Form Message</h2>
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #334155;"><strong>From:</strong> ${escapeHtml(cleanName)} (&lt;<a href="mailto:${escapeHtml(cleanEmail)}" style="color: #2563eb;">${escapeHtml(cleanEmail)}</a>&gt;)</p>
            <p style="margin: 0; font-size: 14px; color: #334155;"><strong>Subject:</strong> ${escapeHtml(cleanSubject)}</p>
          </div>
          <div style="white-space: pre-wrap; color: #1e293b; line-height: 1.6; font-size: 15px; padding: 8px 4px;">
${escapeHtml(cleanMessage)}
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">Sent via macOS Portfolio Contact Form</p>
        </div>
      `,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, id: data?.id });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Internal server error';
    return Response.json({ error: message }, { status: 500 });
  }
}
