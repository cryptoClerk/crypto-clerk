import { Resend } from "resend";

// Initialize Resend client if API key is available
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface InvoiceWithClient {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string | null;
  amount: string;
  token: string;
  status: string;
  paidAmount: string;
  remainingAmount: string;
  userId: string | null;
}

interface ReceiptData {
  id: string;
  txHash: string;
  amount: string;
  token: string;
  fromAddress: string;
  toAddress: string;
}

/**
 * Send notification emails when a payment is detected
 */
export async function sendPaymentNotification(
  invoice: InvoiceWithClient,
  receipt: ReceiptData
): Promise<boolean> {
  try {
    // Send to freelancer (invoice creator) - TODO: get real email from user profile
    await sendEmail({
      to: "freelancer@example.com",
      subject: `Payment Received: Invoice ${invoice.invoiceNumber}`,
      html: `
        <h2>Payment Received!</h2>
        <p>Invoice ${invoice.invoiceNumber} has been paid by ${invoice.clientName}.</p>
        <p><strong>Amount:</strong> ${receipt.amount} ${receipt.token}</p>
        <p><strong>Transaction:</strong> ${receipt.txHash}</p>
        <p>Status: ${invoice.status}</p>
        ${invoice.status === "partial" ? `<p>Remaining: ${invoice.remainingAmount} ${invoice.token}</p>` : ""}
      `,
    });

    // Send receipt to customer if email provided
    if (invoice.clientEmail) {
      await sendEmail({
        to: invoice.clientEmail,
        subject: `Receipt for Payment to ${invoice.clientName}`,
        html: `
          <h2>Payment Receipt</h2>
          <p>Thank you for your payment!</p>
          <p><strong>Amount:</strong> ${receipt.amount} ${receipt.token}</p>
          <p><strong>Transaction:</strong> ${receipt.txHash}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        `,
      });
    }

    return true;
  } catch (error) {
    console.error("Payment notification error:", error);
    return false;
  }
}

/**
 * Send email using Resend if available, otherwise log to console
 */
async function sendEmail(params: EmailPayload): Promise<boolean> {
  const { to, subject, html, from = "noreply@cryptoclerks.com" } = params;

  // If Resend is not configured, log to console (for development)
  if (!resend) {
    console.log("📧 EMAIL (Resend not configured, would send to):");
    console.log(`  To: ${to}`);
    console.log(`  From: ${from}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  HTML: ${html.substring(0, 200)}...`);
    return true;
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend email error:", error);
      return false;
    }

    console.log(`📧 Email sent: ${data?.id}`);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

export { sendEmail };
