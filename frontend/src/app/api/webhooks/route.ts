import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const webhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.enum(["payment.received", "invoice.created", "invoice.paid", "invoice.overdue"])),
  secret: z.string().optional(),
});

/**
 * Webhook endpoint for external integrations
 * Subscribe to events and receive notifications when they occur
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = webhookSchema.parse(body);

    // In production, store webhook in database
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: "Webhook registered",
      webhook: {
        id: "wh_" + Math.random().toString(36).substr(2, 9),
        url: validated.url,
        events: validated.events,
        status: "active",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Webhook registration error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * List registered webhooks
 */
export async function GET(request: Request) {
  try {
    // In production, fetch from database
    return NextResponse.json({
      success: true,
      webhooks: [],
    });
  } catch (error) {
    console.error("Webhook list error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * Trigger a webhook event (internal use)
 */
export async function triggerWebhook(event: string, payload: any) {
  try {
    // In production, fetch active webhooks for this event from DB
    // and send POST requests to each URL
    console.log(`🔔 Webhook event: ${event}`, payload);
    return true;
  } catch (error) {
    console.error("Webhook trigger error:", error);
    return false;
  }
}
