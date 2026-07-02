import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkForPayments } from "@/lib/services/payment-detector";

/**
 * Cron job endpoint for payment detection
 * This should be called every 5 minutes by a cron job
 * 
 * Can be triggered by:
 * - Render cron job
 * - Upstash cron
 * - Vercel cron
 * - Any external scheduler
 */
export async function GET(request: Request) {
  try {
    // Check for authorization (optional, depends on how cron is configured)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if specific invoice requested
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get("invoiceId");

    if (invoiceId) {
      // Check a specific invoice
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { receipts: true },
      });

      if (!invoice) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
      }

      if (!invoice.paymentAddress) {
        return NextResponse.json({ error: "Invoice has no payment address" }, { status: 400 });
      }

      // Import and use the payment detector for single invoice check
      const { checkInvoiceForPayment } = await import("@/lib/services/payment-detector");
      const result = await checkInvoiceForPayment(invoice);

      return NextResponse.json({
        success: true,
        invoiceId,
        ...result,
        timestamp: new Date().toISOString(),
      });
    }

    const results = await checkForPayments();

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Payment watch cron error:", error);
    return NextResponse.json(
      { error: "Payment detection failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
