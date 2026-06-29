import { NextResponse } from "next/server";
import { z } from "zod";
import { createProvider, detectChainFromTxHash, SupportedChain, SUPPORTED_CHAINS, CHAIN_NAMES } from "@/lib/services/blockchain";

const fetchSchema = z.object({
  txHash: z.string().min(1),
  chain: z.enum(SUPPORTED_CHAINS as [string, ...string[]]).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = fetchSchema.parse(body);

    const chain = validated.chain || detectChainFromTxHash(validated.txHash);
    const provider = createProvider(chain);

    const tx = await provider.getTransaction(validated.txHash);

    if (!tx) {
      return NextResponse.json(
        { error: "Transaction not found", errorType: "NOT_FOUND" },
        { status: 404 }
      );
    }

    // Get token transfers for the recipient
    const transfers = await provider.getTokenTransfers(tx.to);
    const transfer = transfers.find((t) => t.txHash === validated.txHash);

    if (!transfer) {
      return NextResponse.json(
        { error: "No token transfer found in this transaction. Make sure it's an ERC-20 transfer (USDC, USDT, DAI, etc.)", errorType: "NOT_TOKEN_TRANSFER" },
        { status: 404 }
      );
    }

    const amount = parseFloat(transfer.value) / Math.pow(10, parseInt(transfer.tokenDecimal));
    const usdValue = amount.toFixed(2); // For stablecoins, 1:1 with USD

    return NextResponse.json({
      success: true,
      data: {
        txHash: validated.txHash,
        chain,
        chainName: CHAIN_NAMES[chain],
        fromAddress: transfer.from,
        toAddress: transfer.to,
        amount: amount.toString(),
        token: transfer.tokenSymbol,
        usdValue,
        date: new Date(parseInt(transfer.timestamp) * 1000).toISOString(),
        blockNumber: transfer.blockNumber,
        gasUsed: transfer.gasUsed,
        gasPrice: transfer.gasPrice,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Transaction fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction", errorType: "FETCH_ERROR" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    supportedChains: SUPPORTED_CHAINS.map((c) => ({
      id: c,
      name: CHAIN_NAMES[c],
    })),
  });
}
