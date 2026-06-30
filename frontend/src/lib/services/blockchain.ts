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
 * TODO: Replace with real Etherscan API when you get API keys.
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
 * REAL PROVIDER (stub)
 *
 * TODO: Implement with actual Etherscan API calls.
 * Requires: ETHERSCAN_API_KEY env variable.
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
    // TODO: Transform Etherscan response to our Transaction type
    throw new Error("EtherscanProvider not yet implemented. Use MockProvider for now.");
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
    // TODO: Transform Etherscan response to our TokenTransfer type
    throw new Error("EtherscanProvider not yet implemented. Use MockProvider for now.");
  }

  async getBalance(address: string): Promise<string> {
    const url = `${this.baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${this.apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    // TODO: Return balance
    throw new Error("EtherscanProvider not yet implemented. Use MockProvider for now.");
  }
}

export function createProvider(chain: string = "ethereum", apiKey?: string): BlockchainProvider {
  if (apiKey && apiKey.length > 0) {
    return new EtherscanProvider(apiKey, chain);
  }
  return new MockProvider(chain);
}
