import { NextResponse } from "next/server";

// Simple email service - logs to console for now
// In production, integrate with Resend, SendGrid, or AWS SES

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const { to, subject, html, from = "noreply@cryptoclerks.com" } = payload;

  // Log email for now
  console.log("📧 EMAIL WOULD BE SENT:");
  console.log(`  To: ${to}`);
  console.log(`  From: ${from}`);
  console.log(`  Subject: ${subject}`);
  console.log(`  HTML: ${html.substring(0, 200)}...`);

  // TODO: Integrate with email provider
  // Examples:
  // - Resend: await resend.emails.send({ from, to, subject, html })
  // - SendGrid: await sgMail.send({ from, to, subject, html })
  // - AWS SES: await ses.sendEmail({...})

  return true;
}

// API endpoint to send emails (protected by auth)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, html, from } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "to, subject, and html are required" },
        { status: 400 }
      );
    }

    const sent = await sendEmail({ to, subject, html, from });

    if (sent) {
      return NextResponse.json({ success: true, message: "Email queued" });
    } else {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
