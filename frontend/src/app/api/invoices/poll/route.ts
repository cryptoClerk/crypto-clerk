import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createProviderFromEnv } from "@/lib/services/blockchain";

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

    const provider = createProviderFromEnv("ethereum");
    let checked = 0;
    let found = 0;

    for (const invoice of pending) {
      if (!invoice.paymentAddress) continue;
      checked++;

      const transfers = await provider.getTokenTransfers(invoice.paymentAddress);
      
      for (const t of transfers) {
        const value = parseFloat(t.value) / Math.pow(10, parseInt(t.tokenDecimal) || 6);
        const amount = parseFloat(invoice.amount);
        
        if (value >= amount && t.tokenSymbol.toUpperCase() === invoice.token.toUpperCase()) {
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: "paid", paymentTxHash: t.txHash },
          });
          found++;
          break;
        }
      }
    }

    return NextResponse.json({ success: true, checked, found });
  } catch (error) {
    console.error("Poll error:", error);
    return NextResponse.json({ error: "Poll failed" }, { status: 500 });
  }
}
