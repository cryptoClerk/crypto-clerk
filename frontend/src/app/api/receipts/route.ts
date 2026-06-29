import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const receiptSchema = z.object({
  txHash: z.string().min(1),
  chain: z.string().default("ethereum"),
  clientName: z.string().min(1),
  description: z.string().min(1),
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = receiptSchema.parse(body);

    // TODO: Replace with real blockchain provider when ETHERSCAN_API_KEY is set
    const { getProviderForChain } = await import("@/lib/services");
    const provider = getProviderForChain(validated.chain);

    const tx = await provider.getTransaction(validated.txHash);
    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Get token transfer details (mock returns token transfers for the "to" address)
    const transfers = await provider.getTokenTransfers(tx.to);
    const transfer = transfers.find((t) => t.txHash === validated.txHash);

    if (!transfer) {
      return NextResponse.json({ error: "Token transfer not found" }, { status: 404 });
    }

    const amount = parseFloat(transfer.value) / Math.pow(10, parseInt(transfer.tokenDecimal));
    const usdValue = amount.toFixed(2); // Mock: 1 token = $1 for stablecoins

    const receipt = await prisma.receipt.create({
      data: {
        txHash: validated.txHash,
        chain: validated.chain,
        fromAddress: transfer.from,
        toAddress: transfer.to,
        amount: amount.toString(),
        token: transfer.tokenSymbol,
        usdValue: usdValue,
        clientName: validated.clientName,
        description: validated.description,
        date: new Date(parseInt(transfer.timestamp) * 1000),
      },
    });

    return NextResponse.json({ success: true, receipt });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Receipt generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const receipts = await prisma.receipt.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ receipts });
}
