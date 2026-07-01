import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        receiptsGenerated: true,
        statementsGenerated: true,
        invoicesGenerated: true,
        plan: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Plan limits
    const limits: Record<string, { receipts: number; statements: number; invoices: number }> = {
      free: { receipts: 5, statements: 5, invoices: 5 },
      pro: { receipts: Infinity, statements: Infinity, invoices: Infinity },
      business: { receipts: Infinity, statements: Infinity, invoices: Infinity },
    };

    const planLimits = limits[user.plan] || limits.free;

    return NextResponse.json({
      success: true,
      data: {
        receipts: {
          used: user.receiptsGenerated,
          limit: planLimits.receipts,
          remaining: Math.max(0, planLimits.receipts - user.receiptsGenerated),
        },
        statements: {
          used: user.statementsGenerated,
          limit: planLimits.statements,
          remaining: Math.max(0, planLimits.statements - user.statementsGenerated),
        },
        invoices: {
          used: user.invoicesGenerated,
          limit: planLimits.invoices,
          remaining: Math.max(0, planLimits.invoices - user.invoicesGenerated),
        },
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("Usage error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
