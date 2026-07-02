import { NextResponse } from "next/server";
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
