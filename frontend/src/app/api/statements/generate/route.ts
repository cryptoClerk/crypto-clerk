import { NextResponse } from "next/server";
import { z } from "zod";
import { createProviderFromEnv } from "@/lib/services/blockchain";
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

    // Calculate USD values and format
    const formattedTransfers = allTransfers.map((t: any) => {
      const amount = parseFloat(t.value) / Math.pow(10, parseInt(t.tokenDecimal));
      const usdCalc = calculateUsdValue(amount, t.tokenSymbol);
      
      return {
        txHash: t.txHash,
        date: new Date(parseInt(t.timestamp) * 1000).toISOString(),
        from: t.from,
        to: t.to,
        amount: amount.toString(),
        token: t.tokenSymbol,
        usdValue: usdCalc.value,
        usdIsEstimated: usdCalc.isEstimated,
        walletAddress: t.walletAddress,
      };
    });

    // Calculate totals (only sum stablecoin values for accurate totals)
    const totalIncome = formattedTransfers.reduce((sum, t) => {
      if (!t.usdIsEstimated) {
        return sum + parseFloat(t.usdValue);
      }
      return sum;
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        transactions: formattedTransfers,
        totalTransactions: formattedTransfers.length,
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
