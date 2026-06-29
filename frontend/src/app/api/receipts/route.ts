import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";

const FREE_TIER_LIMIT = 5;

const receiptSchema = z.object({
  txHash: z.string().min(1),
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

    const { createProvider } = await import("@/lib/services");
    const provider = createProvider(validated.chain);

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
    const usdValue = amount.toFixed(2);

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
        ipAddress: ip,
      },
    });

    return NextResponse.json({ success: true, receipt }, { headers: getRateLimitHeaders(rateLimit) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400, headers: getRateLimitHeaders(rateLimit) });
    }
    console.error("Receipt generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: getRateLimitHeaders(rateLimit) }
    );
  }
}

export async function GET(request: Request) {
  try {
    const ip = getClientIP(request);
    
    // Get receipt count for this IP
    const receiptCount = await prisma.receipt.count({
      where: { ipAddress: ip },
    });
    
    const receipts = await prisma.receipt.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    
    return NextResponse.json({ 
      receipts,
      count: receiptCount,
      limit: FREE_TIER_LIMIT,
      remaining: Math.max(0, FREE_TIER_LIMIT - receiptCount),
    });
  } catch (error) {
    console.error("Receipt fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch receipts" },
      { status: 500 }
    );
  }
}
