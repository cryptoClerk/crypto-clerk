import { NextResponse } from "next/server";
import { z } from "zod";
import { createProviderFromEnv, detectChainFromTxHash, SupportedChain, SUPPORTED_CHAINS, CHAIN_NAMES } from "@/lib/services/blockchain";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";

// Known stablecoins that are ~1:1 with USD
const STABLECOINS = ['USDC', 'USDT', 'DAI', 'BUSD', 'TUSD', 'USDP'];

function calculateUsdValue(amount: number, tokenSymbol: string): { value: string; isEstimated: boolean } {
  const upperToken = tokenSymbol.toUpperCase();
  if (STABLECOINS.includes(upperToken)) {
    return { value: amount.toFixed(2), isEstimated: false };
  }
  // For non-stablecoins, return raw amount with a flag indicating it's not USD
  // TODO: Integrate CoinGecko API for real-time/historical prices
  return { value: amount.toFixed(6), isEstimated: true };
}

// Ethereum tx hash validation
const isValidTxHash = (hash: string) => /^0x[a-fA-F0-9]{64}$/.test(hash);

const fetchSchema = z.object({
  txHash: z.string().min(1).refine(isValidTxHash, {
    message: "Invalid transaction hash format. Must be 0x followed by 64 hex characters.",
  }),
  chain: z.enum(SUPPORTED_CHAINS as [string, ...string[]]).optional(),
});

export async function POST(request: Request) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`tx-fetch:${ip}`, { maxRequests: 30, windowMs: 60 * 1000 });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }

  try {
    const body = await request.json();
    const validated = fetchSchema.parse(body);

    const chain = validated.chain || await detectChainFromTxHash(validated.txHash);
    const provider = createProviderFromEnv(chain);

    const tx = await provider.getTransaction(validated.txHash);

    if (!tx) {
      return NextResponse.json(
        { error: "Transaction not found", errorType: "NOT_FOUND" },
        { status: 404, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    // Get token transfers for the recipient
    const transfers = await provider.getTokenTransfers(tx.to);
    const transfer = transfers.find((t) => t.txHash === validated.txHash);

    if (!transfer) {
      return NextResponse.json(
        { error: "No token transfer found in this transaction. Make sure it's an ERC-20 transfer (USDC, USDT, DAI, etc.)", errorType: "NOT_TOKEN_TRANSFER" },
        { status: 404, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    const amount = parseFloat(transfer.value) / Math.pow(10, parseInt(transfer.tokenDecimal));
    const usdCalc = calculateUsdValue(amount, transfer.tokenSymbol);

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
        usdValue: usdCalc.value,
        usdIsEstimated: usdCalc.isEstimated,
        date: new Date(parseInt(transfer.timestamp) * 1000).toISOString(),
        blockNumber: transfer.blockNumber,
        gasUsed: transfer.gasUsed,
        gasPrice: transfer.gasPrice,
      },
    }, { headers: getRateLimitHeaders(rateLimit) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400, headers: getRateLimitHeaders(rateLimit) });
    }
    logError(error, "Transaction fetch");
    return NextResponse.json(
      { error: "Failed to fetch transaction", errorType: "FETCH_ERROR" },
      { status: 500, headers: getRateLimitHeaders(rateLimit) }
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
