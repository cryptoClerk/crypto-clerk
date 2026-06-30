import { TokenTransfer, Transaction } from "@/data/mockBlockchain";

export interface BlockchainProvider {
  getTransaction(hash: string): Promise<Transaction | null>;
  getTokenTransfers(
    address: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<TokenTransfer[]>;
  getBalance(address: string): Promise<string>;
  getChain(): string;
}

export type SupportedChain = "ethereum" | "polygon" | "bsc" | "arbitrum" | "optimism";

export const SUPPORTED_CHAINS: SupportedChain[] = [
  "ethereum",
  "polygon",
  "bsc",
  "arbitrum",
  "optimism",
];

export const CHAIN_NAMES: Record<string, string> = {
  ethereum: "Ethereum",
  polygon: "Polygon",
  bsc: "BSC",
  arbitrum: "Arbitrum",
  optimism: "Optimism",
};

export const CHAIN_API_KEYS: Record<string, string> = {
  ethereum: "ETHERSCAN_API_KEY",
  polygon: "POLYGONSCAN_API_KEY",
  bsc: "BSCSCAN_API_KEY",
  arbitrum: "ARBISCAN_API_KEY",
  optimism: "OPTIMISTIC_ETHERSCAN_API_KEY",
};

/**
 * Attempt to detect which chain a transaction belongs to.
 * Since all EVM chains share the same tx hash format, we try each chain
 * and return the first one where the transaction is found.
 * For mock data, falls back to ethereum.
 */
export async function detectChainFromTxHash(hash: string): Promise<SupportedChain> {
  const { createProvider } = await import("@/lib/services");
  
  for (const chain of SUPPORTED_CHAINS) {
    try {
      const provider = createProvider(chain);
      const tx = await provider.getTransaction(hash);
      if (tx) return chain;
    } catch {
      // Continue to next chain
    }
  }
  
  // Fallback to ethereum if not found anywhere
  return "ethereum";
}

/**
 * MOCK PROVIDER
 *
 * Falls back to mock data when no API key is available.
 */
export class MockProvider implements BlockchainProvider {
  private chain: string;

  constructor(chain: string = "ethereum") {
    this.chain = chain;
  }

  getChain(): string {
    return this.chain;
  }

  async getTransaction(hash: string): Promise<Transaction | null> {
    const { MOCK_TRANSACTIONS } = await import("@/data/mockBlockchain");
    return MOCK_TRANSACTIONS[hash] || null;
  }

  async getTokenTransfers(
    address: string,
    _startBlock?: number,
    _endBlock?: number
  ): Promise<TokenTransfer[]> {
    const { MOCK_TOKEN_TRANSFERS } = await import("@/data/mockBlockchain");
    return MOCK_TOKEN_TRANSFERS[address] || [];
  }

  async getBalance(_address: string): Promise<string> {
    return "1000000000000000000"; // 1 ETH in wei
  }
}

/**
 * ETHERSCAN PROVIDER
 *
 * Real blockchain data via Etherscan API and its variants.
 */
export class EtherscanProvider implements BlockchainProvider {
  private apiKey: string;
  private chain: string;
  private baseUrl: string;

  constructor(apiKey: string, chain: string = "ethereum") {
    this.apiKey = apiKey;
    this.chain = chain;
    this.baseUrl = this.getBaseUrl(chain);
  }

  private getBaseUrl(chain: string): string {
    const urls: Record<string, string> = {
      ethereum: "https://api.etherscan.io/api",
      polygon: "https://api.polygonscan.com/api",
      bsc: "https://api.bscscan.com/api",
      arbitrum: "https://api.arbiscan.io/api",
      optimism: "https://api-optimistic.etherscan.io/api",
    };
    return urls[chain] || urls.ethereum;
  }

  getChain(): string {
    return this.chain;
  }

  async getTransaction(hash: string): Promise<Transaction | null> {
    const url = `${this.baseUrl}?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${this.apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.error || !data.result || data.result === null) {
      return null;
    }
    
    const tx = data.result;
    
    // Get block timestamp
    let timestamp = "0";
    if (tx.blockNumber) {
      try {
        const blockUrl = `${this.baseUrl}?module=proxy&action=eth_getBlockByNumber&tag=${tx.blockNumber}&boolean=true&apikey=${this.apiKey}`;
        const blockRes = await fetch(blockUrl);
        const blockData = await blockRes.json();
        if (blockData.result && blockData.result.timestamp) {
          timestamp = parseInt(blockData.result.timestamp, 16).toString();
        }
      } catch {
        // Use current time as fallback
        timestamp = Math.floor(Date.now() / 1000).toString();
      }
    }
    
    return {
      txHash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value ? parseInt(tx.value, 16).toString() : "0",
      timestamp,
      blockNumber: tx.blockNumber ? parseInt(tx.blockNumber, 16).toString() : "0",
      gasUsed: tx.gas ? parseInt(tx.gas, 16).toString() : "0",
      gasPrice: tx.gasPrice ? parseInt(tx.gasPrice, 16).toString() : "0",
      isError: tx.isError || "0",
      receiptStatus: tx.txreceipt_status || "1",
    };
  }

  async getTokenTransfers(
    address: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<TokenTransfer[]> {
    const start = startBlock || 0;
    const end = endBlock || 99999999;
    const url = `${this.baseUrl}?module=account&action=tokentx&address=${address}&startblock=${start}&endblock=${end}&sort=desc&apikey=${this.apiKey}`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.status !== "1" || !data.result) {
      return [];
    }
    
    return data.result.map((t: any) => ({
      txHash: t.hash,
      blockNumber: t.blockNumber,
      timestamp: t.timeStamp,
      from: t.from,
      to: t.to,
      value: t.value,
      tokenSymbol: t.tokenSymbol,
      tokenDecimal: t.tokenDecimal,
      contractAddress: t.contractAddress,
      gasUsed: t.gasUsed,
      gasPrice: t.gasPrice,
    }));
  }

  async getBalance(address: string): Promise<string> {
    const url = `${this.baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${this.apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.status !== "1" || !data.result) {
      return "0";
    }
    
    return data.result;
  }
}

export function createProvider(chain: string = "ethereum", apiKey?: string): BlockchainProvider {
  if (apiKey && apiKey.length > 0) {
    return new EtherscanProvider(apiKey, chain);
  }
  return new MockProvider(chain);
}

export function createProviderFromEnv(chain: string = "ethereum"): BlockchainProvider {
  const envKey = CHAIN_API_KEYS[chain] || CHAIN_API_KEYS.ethereum;
  const apiKey = process.env[envKey] || process.env.ETHERSCAN_API_KEY;
  
  if (apiKey && apiKey.length > 0) {
    return new EtherscanProvider(apiKey, chain);
  }
  return new MockProvider(chain);
}
