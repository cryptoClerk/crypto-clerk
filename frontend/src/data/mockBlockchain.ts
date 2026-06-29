/**
 * MOCK BLOCKCHAIN DATA
 * 
 * TODO: Replace with real Etherscan API when you get API keys.
 * See docs/TODO.md for migration instructions.
 */

export interface TokenTransfer {
  txHash: string;
  blockNumber: string;
  timestamp: string;
  from: string;
  to: string;
  value: string;
  tokenSymbol: string;
  tokenDecimal: string;
  contractAddress: string;
  gasUsed?: string;
  gasPrice?: string;
}

export interface Transaction {
  txHash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  blockNumber: string;
  gasUsed: string;
  gasPrice: string;
  isError: string;
  receiptStatus: string;
}

export const MOCK_TOKEN_TRANSFERS: Record<string, TokenTransfer[]> = {
  "0x742d35Cc6634C0532925a3b8D4B6e8C9": [
    {
      txHash: "0xabc123def4567890123456789012345678901234567890123456789012345678",
      blockNumber: "18000000",
      timestamp: "1718457600", // 2024-06-15
      from: "0x1234567890123456789012345678901234567890",
      to: "0x742d35Cc6634C0532925a3b8D4B6e8C9",
      value: "2500000000",
      tokenSymbol: "USDC",
      tokenDecimal: "6",
      contractAddress: "0xA0b86a33E6441e0A421e56f8D6e0f1e9e39cE7f2",
      gasUsed: "45000",
      gasPrice: "20000000000",
    },
    {
      txHash: "0xdef4567890123456789012345678901234567890123456789012345678901234",
      blockNumber: "18001000",
      timestamp: "1718544000", // 2024-06-16
      from: "0xabcdef1234567890123456789012345678901234",
      to: "0x742d35Cc6634C0532925a3b8D4B6e8C9",
      value: "3000000000000000000000",
      tokenSymbol: "USDT",
      tokenDecimal: "18",
      contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      gasUsed: "48000",
      gasPrice: "22000000000",
    },
    {
      txHash: "0x7890123456789012345678901234567890123456789012345678901234567890",
      blockNumber: "18002000",
      timestamp: "1718630400", // 2024-06-17
      from: "0x9876543210987654321098765432109876543210",
      to: "0x742d35Cc6634C0532925a3b8D4B6e8C9",
      value: "5000000000000000000000",
      tokenSymbol: "DAI",
      tokenDecimal: "18",
      contractAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      gasUsed: "52000",
      gasPrice: "18000000000",
    },
  ],
  "0xAABBCCDDEEFF00112233445566778899AABBCCDD": [
    {
      txHash: "0x1122334455667788990011223344556677889900112233445566778899001122",
      blockNumber: "18050000",
      timestamp: "1721059200", // 2024-07-15
      from: "0x2222222222222222222222222222222222222222",
      to: "0xAABBCCDDEEFF00112233445566778899AABBCCDD",
      value: "10000000000000000000000",
      tokenSymbol: "USDC",
      tokenDecimal: "18",
      contractAddress: "0xA0b86a33E6441e0A421e56f8D6e0f1e9e39cE7f2",
      gasUsed: "46000",
      gasPrice: "25000000000",
    },
  ],
};

export const MOCK_TRANSACTIONS: Record<string, Transaction> = {
  "0xabc123def4567890123456789012345678901234567890123456789012345678": {
    txHash: "0xabc123def4567890123456789012345678901234567890123456789012345678",
    from: "0x1234567890123456789012345678901234567890",
    to: "0x742d35Cc6634C0532925a3b8D4B6e8C9",
    value: "0",
    timestamp: "1718457600",
    blockNumber: "18000000",
    gasUsed: "45000",
    gasPrice: "20000000000",
    isError: "0",
    receiptStatus: "1",
  },
};

export const MOCK_PRICE_HISTORY: Record<string, Record<string, number>> = {
  USDC: {
    "2024-06-15": 1.0,
    "2024-06-16": 1.0,
    "2024-06-17": 1.0,
    "2024-07-15": 1.0,
  },
  USDT: {
    "2024-06-16": 1.0,
  },
  DAI: {
    "2024-06-17": 1.0,
  },
};
