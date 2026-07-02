import { prisma } from "@/lib/db";

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
    // Send to freelancer (invoice creator)
    await sendEmail({
      to: "freelancer@example.com", // TODO: get from user profile
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
 * Simple email wrapper - currently logs to console, replace with real provider
 */
async function sendEmail(params: { to: string; subject: string; html: string }): Promise<boolean> {
  console.log("📧 EMAIL WOULD BE SENT:");
  console.log(`  To: ${params.to}`);
  console.log(`  Subject: ${params.subject}`);
  console.log(`  HTML: ${params.html.substring(0, 200)}...`);
  
  // TODO: Integrate with Resend, SendGrid, or AWS SES
  // await resend.emails.send(params);
  
  return true;
}
