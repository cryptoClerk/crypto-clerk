import { NextResponse } from "next/server";
import { z } from "zod";
import { createProviderFromEnv } from "@/lib/services/blockchain";
import { batchCalculateUsdValues } from "@/lib/services/price";
import { logError } from "@/lib/logger";
import { prisma } from "@/lib/db";

const statementSchema = z.object({
  walletAddresses: z.array(z.string().min(1)).min(1),
  chain: z.string().default("ethereum"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = statementSchema.parse(body);

    const provider = createProviderFromEnv(validated.chain);
    const allTransfers: any[] = [];

    // Fetch token transfers for each wallet
    for (const address of validated.walletAddresses) {
      const transfers = await provider.getTokenTransfers(address);
      
      // Filter by date range if provided (compare ISO strings to avoid timezone issues)
      const filteredTransfers = transfers.filter((t: any) => {
        const txTimestamp = parseInt(t.timestamp) * 1000;
        const txDateISO = new Date(txTimestamp).toISOString().split('T')[0];
        
        if (validated.startDate) {
          if (txDateISO < validated.startDate) return false;
        }
        
        if (validated.endDate) {
          if (txDateISO > validated.endDate) return false;
        }
        
        return true;
      });

      allTransfers.push(...filteredTransfers.map((t: any) => ({
        ...t,
        walletAddress: address,
      })));
    }

    // Sort by timestamp (newest first)
    allTransfers.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));

    // Prepare price lookup items
    const priceItems = allTransfers.map((t: any) => ({
      contractAddress: t.contractAddress || "0x0000000000000000000000000000000000000000",
      chain: validated.chain,
      symbol: t.tokenSymbol,
      amount: t.value,
      decimals: parseInt(t.tokenDecimal) || 18,
      date: new Date(parseInt(t.timestamp) * 1000).toISOString().split('T')[0],
    }));

    // Calculate USD values (with caching)
    const priceResults = await batchCalculateUsdValues(priceItems);

    // Format transfers with USD values
    const formattedTransfers = allTransfers.map((t: any, index: number) => {
      const priceResult = priceResults[index];
      const amount = parseFloat(t.value) / Math.pow(10, parseInt(t.tokenDecimal) || 18);
      
      return {
        txHash: t.txHash,
        date: new Date(parseInt(t.timestamp) * 1000).toISOString(),
        from: t.from,
        to: t.to,
        amount: amount.toString(),
        token: t.tokenSymbol,
        usdValue: priceResult.value || null,
        usdIsEstimated: priceResult.isEstimated,
        priceSource: priceResult.source,
        walletAddress: t.walletAddress,
      };
    });

    // Calculate totals (sum all transactions with valid USD values)
    const totalIncome = formattedTransfers.reduce((sum, t) => {
      if (t.usdValue !== null) {
        return sum + parseFloat(t.usdValue);
      }
      return sum;
    }, 0);

    // Count how many have prices vs don't
    const pricedCount = formattedTransfers.filter((t: any) => t.usdValue !== null).length;

    // Save to statement history
    try {
      await prisma.statement.create({
        data: {
          startDate: validated.startDate || new Date().toISOString().split('T')[0],
          endDate: validated.endDate || new Date().toISOString().split('T')[0],
          chain: validated.chain,
          totalTransactions: formattedTransfers.length,
          totalIncome: totalIncome.toFixed(2),
          walletCount: validated.walletAddresses.length,
        },
      });
    } catch (err) {
      console.error("Failed to save statement history:", err);
      // Don't fail the request if history save fails
    }

    return NextResponse.json({
      success: true,
      data: {
        transactions: formattedTransfers,
        totalTransactions: formattedTransfers.length,
        pricedTransactions: pricedCount,
        totalIncome: totalIncome.toFixed(2),
        walletCount: validated.walletAddresses.length,
        startDate: validated.startDate,
        endDate: validated.endDate,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    logError(error, "Statement generation");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
