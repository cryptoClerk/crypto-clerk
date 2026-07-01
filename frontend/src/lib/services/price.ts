import { prisma } from "@/lib/db";

// CoinGecko free tier: 30 calls/min, 10,000 calls/month
// Historical data: 365 days max on free tier
// Older data requires paid plan ($129+/mo)

const COINGECKO_API = "https://api.coingecko.com/api/v3";
const FREE_TIER_DAYS = 365;
const API_TIMEOUT_MS = 5000; // 5s per CoinGecko call
const MAX_CONCURRENT_REQUESTS = 5; // don't overwhelm CoinGecko

// Well-known CoinGecko IDs for common tokens (avoid extra API calls)
const KNOWN_COINS: Record<string, string> = {
  "0x0000000000000000000000000000000000000000": "ethereum", // ETH (native)
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "weth",     // WETH
  "0xa0b86a33e6441e0a421e56e4773c3c0b5f4f0d71": "usdc",     // USDC
  "0xdac17f958d2ee523a2206206994597c13d831ec7": "tether",    // USDT
  "0x6b175474e89094c44da98b954eedeac495271d0f": "dai",       // DAI
  "0x4fabb145d64652a948d72533023f6e7a623c7c53": "binance-usd", // BUSD
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": "wrapped-bitcoin", // WBTC
  "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0": "matic-network", // MATIC (old)
  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270": "wmatic",    // WMATIC
  "0xb8c77482e45f1f44de1745f52c74426c631bdd52": "binancecoin", // BNB (BSC)
  "0x4d224452801aced8b2f0aebe155379bb5d594381": "apecoin",    // APE
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984": "uniswap",    // UNI
  "0x514910771af9ca656af840dff83e8264ecf986ca": "chainlink",  // LINK
  "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9": "aave",      // AAVE
  "0x0f5d2fb29fb7d3cfee444a200298f468908cc942": "decentraland", // MANA
  "0x3845badade8e6dff049820680d1f14bd3903a5d0": "the-sandbox", // SAND
};

interface PriceResult {
  price: string | null;
  isEstimated: boolean;
  isFallback: boolean;
  source: string;
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, next: { revalidate: 86400 } });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

async function runWithConcurrency<T>(
  items: T[],
  fn: (item: T) => Promise<void>,
  concurrency: number
): Promise<void> {
  const executing: Promise<void>[] = [];
  for (const item of items) {
    const p = fn(item);
    executing.push(p);
    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(executing.findIndex(ep => ep === p), 1);
    }
  }
  await Promise.all(executing);
}

/**
 * Look up historical price for a token at a specific date.
 * Checks cache first, then CoinGecko API.
 * Returns null if:
 * - Date is older than FREE_TIER_DAYS
 * - Token not found on CoinGecko
 * - Rate limit exceeded
 */
export async function getHistoricalPrice(
  contractAddress: string,
  chain: string,
  symbol: string,
  date: string // YYYY-MM-DD
): Promise<PriceResult> {
  const normalizedAddress = contractAddress.toLowerCase();
  const chainId = chain.toLowerCase();

  // 1. Check cache first
  const cached = await prisma.coinPrice.findUnique({
    where: {
      contractAddress_chain_date: {
        contractAddress: normalizedAddress,
        chain: chainId,
        date,
      },
    },
  });

  if (cached) {
    return {
      price: cached.priceUsd,
      isEstimated: false,
      isFallback: cached.source === "fallback",
      source: cached.source,
    };
  }

  // 2. Check if date is within free tier range
  const dateObj = new Date(date);
  const today = new Date();
  const daysDiff = Math.floor((today.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff > FREE_TIER_DAYS) {
    // Too old for free tier — store null so we don't retry
    await prisma.coinPrice.create({
      data: {
        contractAddress: normalizedAddress,
        chain: chainId,
        date,
        symbol: symbol.toUpperCase(),
        priceUsd: null,
        source: "coingecko_limit",
      },
    }).catch(() => {}); // ignore duplicate errors
    return { price: null, isEstimated: false, isFallback: true, source: "coingecko_limit" };
  }

  // 3. Try CoinGecko API with timeout
  try {
    const price = await fetchCoinGeckoPrice(normalizedAddress, chainId, symbol, date);
    
    if (price !== null) {
      await prisma.coinPrice.create({
        data: {
          contractAddress: normalizedAddress,
          chain: chainId,
          date,
          symbol: symbol.toUpperCase(),
          coinId: price.coinId,
          priceUsd: price.priceUsd,
          source: "coingecko",
        },
      }).catch(() => {}); // ignore duplicate errors
      return { price: price.priceUsd, isEstimated: false, isFallback: false, source: "coingecko" };
    }
  } catch (err) {
    console.warn(`CoinGecko price fetch failed for ${symbol} on ${date}:`, err);
  }

  // 4. Store null in cache to avoid retrying
  await prisma.coinPrice.create({
    data: {
      contractAddress: normalizedAddress,
      chain: chainId,
      date,
      symbol: symbol.toUpperCase(),
      priceUsd: null,
      source: "fallback",
    },
  }).catch(() => {}); // ignore duplicate errors

  return { price: null, isEstimated: false, isFallback: true, source: "fallback" };
}

async function fetchCoinGeckoPrice(
  contractAddress: string,
  chain: string,
  symbol: string,
  date: string
): Promise<{ coinId: string; priceUsd: string } | null> {
  // Step 1: Get coin ID
  let coinId = KNOWN_COINS[contractAddress];
  
  if (!coinId) {
    // Try to look up by contract address
    const platformMap: Record<string, string> = {
      "ethereum": "ethereum",
      "polygon": "polygon-pos",
      "bsc": "binance-smart-chain",
      "arbitrum": "arbitrum-one",
      "optimism": "optimistic-ethereum",
      "base": "base",
    };
    
    const platform = platformMap[chain] || chain;
    
    try {
      const res = await fetchWithTimeout(
        `${COINGECKO_API}/coins/${platform}/contract/${contractAddress}`,
        API_TIMEOUT_MS
      );
      
      if (res.ok) {
        const data = await res.json();
        coinId = data.id;
      }
    } catch (err) {
      console.warn(`Failed to look up CoinGecko coin ID for ${contractAddress} on ${platform}:`, err);
    }
  }
  
  if (!coinId) {
    return null;
  }

  // Step 2: Get historical price at the date
  // CoinGecko /history endpoint: date in DD-MM-YYYY format
  const dateParts = date.split("-");
  const cgDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  
  const res = await fetchWithTimeout(
    `${COINGECKO_API}/coins/${coinId}/history?date=${cgDate}&localization=false`,
    API_TIMEOUT_MS
  );
  
  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("CoinGecko rate limit exceeded");
    }
    return null;
  }
  
  const data = await res.json();
  const price = data.market_data?.current_price?.usd;
  
  if (typeof price === "number") {
    return { coinId, priceUsd: price.toString() };
  }
  
  return null;
}

/**
 * Calculate USD value for a transaction amount.
 * Uses historical price if available, otherwise returns null.
 */
export async function calculateUsdValue(
  contractAddress: string,
  chain: string,
  symbol: string,
  amount: string, // raw token amount (not adjusted for decimals)
  decimals: number,
  date: string
): Promise<{ value: string | null; isEstimated: boolean; source: string }> {
  // Stablecoins are always 1:1
  const upperSymbol = symbol.toUpperCase();
  const STABLECOINS = ["USDC", "USDT", "DAI", "BUSD", "TUSD", "USDP", "FDUSD", "GUSD"];
  
  if (STABLECOINS.includes(upperSymbol)) {
    const value = (parseFloat(amount) / Math.pow(10, decimals)).toFixed(2);
    return { value, isEstimated: false, source: "stablecoin" };
  }
  
  // Get historical price
  const priceResult = await getHistoricalPrice(contractAddress, chain, symbol, date);
  
  if (!priceResult.price) {
    return { value: null, isEstimated: false, source: priceResult.source };
  }
  
  // Calculate: amount * price / 10^decimals
  const adjustedAmount = parseFloat(amount) / Math.pow(10, decimals);
  const usdValue = (adjustedAmount * parseFloat(priceResult.price)).toFixed(2);
  
  return { 
    value: usdValue, 
    isEstimated: true, // CoinGecko prices are estimates (market average)
    source: priceResult.source 
  };
}

// Max new CoinGecko API calls per request to stay within serverless timeout
const MAX_NEW_PRICE_LOOKUPS = 50;

/**
 * Batch fetch prices for multiple transactions with concurrency control.
 * Group by unique token + date to minimize API calls.
 * Limits new API calls to MAX_NEW_PRICE_LOOKUPS to avoid serverless timeouts.
 */
export async function batchCalculateUsdValues(
  items: Array<{
    contractAddress: string;
    chain: string;
    symbol: string;
    amount: string;
    decimals: number;
    date: string;
  }>
): Promise<Array<{ value: string | null; isEstimated: boolean; source: string }>> {
  // Group by unique (contractAddress, chain, date) to minimize API calls
  const uniqueKeys = new Map<string, { item: typeof items[0]; indices: number[] }>();
  
  items.forEach((item, index) => {
    const key = `${item.contractAddress.toLowerCase()}-${item.chain.toLowerCase()}-${item.date}`;
    if (!uniqueKeys.has(key)) {
      uniqueKeys.set(key, { item, indices: [] });
    }
    uniqueKeys.get(key)!.indices.push(index);
  });
  
  const results: Array<{ value: string | null; isEstimated: boolean; source: string }> = 
    new Array(items.length).fill({ value: null, isEstimated: false, source: "fallback" });
  
  // Check cache first for all unique combinations
  const uniqueEntries = Array.from(uniqueKeys.entries());
  const cachedResults = new Map<string, { value: string | null; isEstimated: boolean; source: string }>();
  let newLookupCount = 0;
  
  for (const [key, { item }] of uniqueEntries) {
    const cached = await prisma.coinPrice.findUnique({
      where: {
        contractAddress_chain_date: {
          contractAddress: item.contractAddress.toLowerCase(),
          chain: item.chain.toLowerCase(),
          date: item.date,
        },
      },
    });
    
    if (cached) {
      cachedResults.set(key, {
        value: cached.priceUsd,
        isEstimated: false,
        source: cached.source,
      });
    } else if (newLookupCount < MAX_NEW_PRICE_LOOKUPS) {
      newLookupCount++;
    }
  }
  
  // Process only the ones that need new API calls, up to the limit
  const entriesNeedingLookup = uniqueEntries.filter(([key]) => !cachedResults.has(key));
  const entriesToLookup = entriesNeedingLookup.slice(0, MAX_NEW_PRICE_LOOKUPS);
  const skippedEntries = entriesNeedingLookup.slice(MAX_NEW_PRICE_LOOKUPS);
  
  await runWithConcurrency(
    entriesToLookup,
    async ([key, { item, indices }]) => {
      const result = await calculateUsdValue(
        item.contractAddress,
        item.chain,
        item.symbol,
        item.amount,
        item.decimals,
        item.date
      );
      
      cachedResults.set(key, result);
    },
    MAX_CONCURRENT_REQUESTS
  );
  
  // Apply results to all indices
  for (const [key, { indices }] of uniqueEntries) {
    const result = cachedResults.get(key) || { value: null, isEstimated: false, source: "skipped" };
    for (const index of indices) {
      results[index] = result;
    }
  }
  
  return results;
}
