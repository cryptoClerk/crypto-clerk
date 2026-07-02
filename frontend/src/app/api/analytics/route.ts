import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // Count total invoices
    const totalInvoices = await prisma.invoice.count({
      where: { userId },
    });

    // Count invoices by status
    const pendingInvoices = await prisma.invoice.count({
      where: { userId, status: "pending" },
    });
    const paidInvoices = await prisma.invoice.count({
      where: { userId, status: { in: ["paid", "overpaid"] } },
    });
    const partialInvoices = await prisma.invoice.count({
      where: { userId, status: "partial" },
    });

    // Count total receipts
    const totalReceipts = await prisma.receipt.count({
      where: { userId },
    });

    // Count auto-generated receipts (linked to invoices)
    const autoReceipts = await prisma.receipt.count({
      where: { userId, invoiceId: { not: null } },
    });

    // Calculate total volume (sum of all invoice amounts)
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      select: { amount: true },
    });
    const totalVolume = invoices.reduce((sum, inv) => {
      return sum + parseFloat(inv.amount || "0");
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        totalInvoices,
        totalReceipts,
        autoReceipts,
        pendingInvoices,
        paidInvoices,
        partialInvoices,
        totalVolume: totalVolume.toFixed(2),
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
