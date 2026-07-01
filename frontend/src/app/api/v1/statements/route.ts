import { NextRequest, NextResponse } from "next/server";
import { apiAuthMiddleware } from "@/lib/api-auth";
import { createProviderFromEnv } from "@/lib/services/blockchain";
import { batchCalculateUsdValues } from "@/lib/services/price";

export const POST = apiAuthMiddleware(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { walletAddresses, startDate, endDate, chain = "ethereum" } = body;

    if (!walletAddresses || !Array.isArray(walletAddresses) || walletAddresses.length === 0) {
      return NextResponse.json({ error: "walletAddresses array is required" }, { status: 400 });
    }

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "startDate and endDate are required" }, { status: 400 });
    }

    const provider = createProviderFromEnv(chain);
    let allTransfers: any[] = [];

    for (const address of walletAddresses) {
      const transfers = await provider.getTokenTransfers(address);
      allTransfers.push(...transfers);
    }

    // Filter by date
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    const filtered = allTransfers.filter((t: any) => {
      const txTime = new Date(parseInt(t.timestamp) * 1000).getTime();
      return txTime >= start && txTime <= end;
    });

    // Calculate USD values
    const priceItems = filtered.map((t: any) => ({
      contractAddress: t.contractAddress || "0x0000000000000000000000000000000000000000",
      chain: chain.toLowerCase(),
      symbol: t.tokenSymbol,
      amount: t.value,
      decimals: parseInt(t.tokenDecimal) || 18,
      date: new Date(parseInt(t.timestamp) * 1000).toISOString().split("T")[0],
    }));

    const prices = await batchCalculateUsdValues(priceItems);

    const transactions = filtered.map((t: any, index: number) => ({
      txHash: t.txHash,
      date: new Date(parseInt(t.timestamp) * 1000).toISOString(),
      from: t.from,
      to: t.to,
      amount: (parseFloat(t.value) / Math.pow(10, parseInt(t.tokenDecimal) || 18)).toString(),
      token: t.tokenSymbol,
      usdValue: prices[index]?.value || null,
      priceSource: prices[index]?.source || "fallback",
    }));

    const totalIncome = transactions.reduce((sum: number, t: any) => {
      return sum + (t.usdValue ? parseFloat(t.usdValue) : 0);
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        totalTransactions: transactions.length,
        pricedTransactions: transactions.filter((t: any) => t.usdValue).length,
        totalIncome: totalIncome.toFixed(2),
        walletCount: walletAddresses.length,
        startDate,
        endDate,
        chain,
      },
    });
  } catch (error) {
    console.error("API statement error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
});
