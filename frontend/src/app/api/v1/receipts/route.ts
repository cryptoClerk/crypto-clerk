import { NextRequest, NextResponse } from "next/server";
import { apiAuthMiddleware } from "@/lib/api-auth";
import { createProviderFromEnv } from "@/lib/services/blockchain";

export const POST = apiAuthMiddleware(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { txHash, chain = "ethereum" } = body;

    if (!txHash) {
      return NextResponse.json({ error: "txHash is required" }, { status: 400 });
    }

    const provider = createProviderFromEnv(chain);
    const tx = await provider.getTransaction(txHash);

    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        txHash: tx.txHash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        timestamp: tx.timestamp,
        blockNumber: tx.blockNumber,
        chain,
      },
    });
  } catch (error) {
    console.error("API receipt error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
});
