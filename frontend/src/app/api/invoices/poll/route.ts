import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  // Simple auth: check a secret key
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.POLL_SECRET || "dev-secret"}`;
  if (authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pending = await prisma.invoice.findMany({
      where: { status: "pending" },
    });

    // TODO: re-enable payment polling when paymentAddress is migrated to DB
    // For now, this endpoint returns the count of pending invoices
    return NextResponse.json({ 
      success: true, 
      checked: 0, 
      found: 0,
      pendingCount: pending.length,
      message: "Payment polling disabled — paymentAddress field not yet in DB"
    });
  } catch (error) {
    console.error("Poll error:", error);
    return NextResponse.json({ error: "Poll failed" }, { status: 500 });
  }
}
