import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
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

const FREE_TIER_LIMIT = 5;

// Ethereum tx hash validation
const isValidTxHash = (hash: string) => /^0x[a-fA-F0-9]{64}$/.test(hash);

const receiptSchema = z.object({
  txHash: z.string().min(1).refine(isValidTxHash, {
    message: "Invalid transaction hash format. Must be 0x followed by 64 hex characters.",
  }),
  chain: z.string().min(1),
  clientName: z.string().min(1),
  description: z.string().min(1),
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
});

function getClientIP(request: Request): string {
  return request.headers.get("x-forwarded-for") || 
         request.headers.get("x-real-ip") || 
         "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIP(request);
  
  // Rate limiting
  const rateLimit = checkRateLimit(`receipt:${ip}`, { maxRequests: 20, windowMs: 60 * 1000 });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }

  try {
    const body = await request.json();
    const validated = receiptSchema.parse(body);

    // Check free tier limit per IP
    const receiptCount = await prisma.receipt.count({
      where: { ipAddress: ip },
    });
    
    if (receiptCount >= FREE_TIER_LIMIT) {
      return NextResponse.json(
        { 
          error: "Free tier limit reached. Upgrade to Pro for unlimited receipts.",
          errorType: "FREE_TIER_LIMIT",
          limit: FREE_TIER_LIMIT,
          current: receiptCount,
        },
        { status: 403, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    const { createProviderFromEnv } = await import("@/lib/services");
    const provider = createProviderFromEnv(validated.chain);

    const tx = await provider.getTransaction(validated.txHash);
    if (!tx) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    const transfers = await provider.getTokenTransfers(tx.to);
    const transfer = transfers.find((t) => t.txHash === validated.txHash);

    if (!transfer) {
      return NextResponse.json(
        { error: "No token transfer found in this transaction" },
        { status: 404, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    const amount = parseFloat(transfer.value) / Math.pow(10, parseInt(transfer.tokenDecimal));
    const usdCalc = calculateUsdValue(amount, transfer.tokenSymbol);

    const receipt = await prisma.receipt.create({
      data: {
        txHash: validated.txHash,
        chain: validated.chain,
        fromAddress: transfer.from,
        toAddress: transfer.to,
        amount: amount.toString(),
        token: transfer.tokenSymbol,
        usdValue: usdCalc.value,
        clientName: validated.clientName,
        description: validated.description,
        businessName: validated.businessName,
        businessAddress: validated.businessAddress,
        date: new Date(parseInt(transfer.timestamp) * 1000),
        ipAddress: ip,
      },
    });

    return NextResponse.json(
      { success: true, receipt, usdIsEstimated: usdCalc.isEstimated },
      { headers: getRateLimitHeaders(rateLimit) }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400, headers: getRateLimitHeaders(rateLimit) });
    }
    logError(error, "Receipt generation");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: getRateLimitHeaders(rateLimit) }
    );
  }
}

export async function GET(request: Request) {
  try {
    const ip = getClientIP(request);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100); // Max 100 per page
    const skip = (page - 1) * limit;
    
    // Get total count for this IP
    const totalCount = await prisma.receipt.count({
      where: { ipAddress: ip },
    });
    
    const receipts = await prisma.receipt.findMany({
      where: { ipAddress: ip },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });
    
    return NextResponse.json({ 
      receipts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + receipts.length < totalCount,
      },
      count: totalCount,
      freeTierLimit: FREE_TIER_LIMIT,
      remaining: Math.max(0, FREE_TIER_LIMIT - totalCount),
    });
  } catch (error) {
    logError(error, "Receipt fetch");
    return NextResponse.json(
      { error: "Failed to fetch receipts" },
      { status: 500 }
    );
  }
}
