import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

// Configuration from environment
const API_KEY = process.env.CRYPTOBOOKS_API_KEY || "";
const BASE_URL = process.env.CRYPTOBOOKS_BASE_URL || "https://crypto-clerk.onrender.com/api/v1";

if (!API_KEY) {
  console.error("Warning: CRYPTOBOOKS_API_KEY not set. API calls will fail.");
}

// Helper to make authenticated API requests
async function apiRequest(method: string, endpoint: string, body?: unknown): Promise<unknown> {
  const url = `${BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error ${response.status}: ${error}`);
  }

  return response.json();
}

// Define all tools
const TOOLS: Tool[] = [
  {
    name: "generate_receipt",
    description: "Generate a professional receipt from a blockchain transaction hash. Use this when a user has received a crypto payment and wants a receipt for accounting/tax purposes. Supports Ethereum, Polygon, BSC, Arbitrum, Optimism, and Base.",
    inputSchema: {
      type: "object",
      properties: {
        txHash: {
          type: "string",
          description: "The 66-character blockchain transaction hash (0x + 64 hex characters). Example: 0x7f8c9d2e...a1b2c3d4",
        },
        chain: {
          type: "string",
          description: "The blockchain network where the transaction occurred. Must be one of: ethereum, polygon, bsc, arbitrum, optimism, base",
          enum: ["ethereum", "polygon", "bsc", "arbitrum", "optimism", "base"],
        },
        clientName: {
          type: "string",
          description: "The name of the client/entity who made the payment. Example: Acme Corp",
        },
        description: {
          type: "string",
          description: "Description of the work/service that was paid for. Example: Website design work",
        },
        businessName: {
          type: "string",
          description: "Optional. Your business name to include on the receipt. Example: My Freelance LLC",
        },
        businessAddress: {
          type: "string",
          description: "Optional. Your business address to include on the receipt.",
        },
      },
      required: ["txHash", "chain", "clientName", "description"],
    },
  },
  {
    name: "create_statement",
    description: "Generate a bank-style statement from wallet addresses for a date range. Fetches all token transfers (USDC, USDT, DAI, etc.) and calculates USD values. Use this for monthly accounting or tax summaries.",
    inputSchema: {
      type: "object",
      properties: {
        walletAddresses: {
          type: "array",
          items: { type: "string" },
          description: "Array of wallet addresses to include in the statement. Example: [\"0x1234...5678\", \"0xabcd...efgh\"]",
        },
        startDate: {
          type: "string",
          description: "Start date in YYYY-MM-DD format. Example: 2026-01-01",
        },
        endDate: {
          type: "string",
          description: "End date in YYYY-MM-DD format. Example: 2026-06-30",
        },
        chain: {
          type: "string",
          description: "Blockchain network. Default: ethereum. Must be one of: ethereum, polygon, bsc, arbitrum, optimism, base",
          enum: ["ethereum", "polygon", "bsc", "arbitrum", "optimism", "base"],
        },
      },
      required: ["walletAddresses"],
    },
  },
  {
    name: "get_statement_history",
    description: "Get previously generated statements. Useful for reviewing past accounting periods or downloading historical statements.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of statements to return. Default: 20, Max: 100",
        },
      },
    },
  },
  {
    name: "create_invoice",
    description: "Create a professional invoice for a client. Generates an invoice number and payment link. Supports USDC, USDT, DAI, and other tokens. The client can pay via the generated link.",
    inputSchema: {
      type: "object",
      properties: {
        clientName: {
          type: "string",
          description: "The name of the client being invoiced. Example: Acme Corp",
        },
        clientEmail: {
          type: "string",
          description: "Optional. Client's email address for notifications. Example: client@acme.com",
        },
        amount: {
          type: "string",
          description: "The amount to invoice, as a string to preserve decimals. Example: 5000.00",
        },
        token: {
          type: "string",
          description: "The token/currency for the invoice. Examples: USDC, USDT, DAI, ETH",
        },
        dueDate: {
          type: "string",
          description: "Optional. Due date in YYYY-MM-DD format. Example: 2026-07-15",
        },
      },
      required: ["clientName", "amount", "token"],
    },
  },
  {
    name: "list_invoices",
    description: "List all invoices. Use this to check status of pending invoices, find overdue payments, or review invoice history.",
    inputSchema: {
      type: "object",
      properties: {},
      description: "No parameters required. Returns all invoices.",
    },
  },
  {
    name: "get_invoice",
    description: "Get details of a specific invoice by ID. Includes payment status, payment link, and payment address.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The invoice ID (UUID format). Example: 550e8400-e29b-41d4-a716-446655440000",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "download_invoice_pdf",
    description: "Download a PDF version of an invoice. Returns a download URL that can be shared with clients or stored for records.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The invoice ID (UUID format).",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "add_wallet",
    description: "Add a wallet address to track for statements. Once added, you can include it in statement generation.",
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "The 42-character Ethereum wallet address (0x + 40 hex characters). Example: 0x1234567890abcdef1234567890abcdef12345678",
        },
        chain: {
          type: "string",
          description: "Blockchain network. Must be one of: ethereum, polygon, bsc, arbitrum, optimism, base",
          enum: ["ethereum", "polygon", "bsc", "arbitrum", "optimism", "base"],
        },
        label: {
          type: "string",
          description: "Optional. Display name for the wallet. Example: Main Wallet, DAO Payments",
        },
      },
      required: ["address", "chain"],
    },
  },
  {
    name: "list_wallets",
    description: "List all connected wallets with pagination. Use this to see which wallets are being tracked.",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "Page number. Default: 1",
        },
        limit: {
          type: "number",
          description: "Items per page. Default: 20, Max: 100",
        },
      },
    },
  },
  {
    name: "remove_wallet",
    description: "Remove a wallet from tracking. Use the wallet ID (not the address) from list_wallets.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The wallet ID (UUID format). Get this from list_wallets.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "get_usage",
    description: "Check current usage and limits. Shows how many receipts, statements, and invoices have been used this month, and how many remain on the free plan.",
    inputSchema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "Your user ID. Get this from your dashboard or profile.",
        },
      },
      required: ["userId"],
    },
  },
  {
    name: "get_payment_status",
    description: "Check the payment status of a specific invoice. Returns whether the invoice is pending, partially paid, paid in full, or overpaid. Includes payment details and linked receipts.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The invoice ID (UUID format). Example: 550e8400-e29b-41d4-a716-446655440000",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "watch_invoice_payment",
    description: "Trigger a payment check for an invoice. This will poll the blockchain for token transfers to the invoice's payment address. Use this when you want to detect if a customer has paid an invoice.",
    inputSchema: {
      type: "object",
      properties: {
        invoiceId: {
          type: "string",
          description: "The invoice ID to check for payments.",
        },
      },
      required: ["invoiceId"],
    },
  },
  {
    name: "list_recent_payments",
    description: "List recently detected payments across all invoices. Shows auto-generated receipts and matched invoices. Useful for reviewing recent payment activity.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of payments to return. Default: 20",
        },
      },
    },
  },
];

// Create server
const server = new Server(
  {
    name: "cryptoclerks",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: unknown;

    switch (name) {
      case "generate_receipt": {
        const { txHash, chain, clientName, description, businessName, businessAddress } = args as {
          txHash: string;
          chain: string;
          clientName: string;
          description: string;
          businessName?: string;
          businessAddress?: string;
        };
        result = await apiRequest("POST", "/receipts", {
          txHash,
          chain,
          clientName,
          description,
          businessName,
          businessAddress,
        });
        break;
      }

      case "create_statement": {
        const { walletAddresses, startDate, endDate, chain } = args as {
          walletAddresses: string[];
          startDate?: string;
          endDate?: string;
          chain?: string;
        };
        result = await apiRequest("POST", "/statements", {
          walletAddresses,
          startDate,
          endDate,
          chain: chain || "ethereum",
        });
        break;
      }

      case "get_statement_history": {
        const { limit } = args as { limit?: number };
        const queryParams = limit ? `?limit=${limit}` : "";
        result = await apiRequest("GET", `/statements/history${queryParams}`);
        break;
      }

      case "create_invoice": {
        const { clientName, clientEmail, amount, token, dueDate } = args as {
          clientName: string;
          clientEmail?: string;
          amount: string;
          token: string;
          dueDate?: string;
        };
        result = await apiRequest("POST", "/invoices", {
          clientName,
          clientEmail,
          amount,
          token,
          dueDate,
        });
        break;
      }

      case "list_invoices": {
        result = await apiRequest("GET", "/invoices");
        break;
      }

      case "get_invoice": {
        const { id } = args as { id: string };
        result = await apiRequest("GET", `/invoices/${id}`);
        break;
      }

      case "download_invoice_pdf": {
        const { id } = args as { id: string };
        // Return the PDF URL since we can't directly transfer binary through MCP
        result = {
          success: true,
          downloadUrl: `${BASE_URL.replace("/api/v1", "")}/api/invoices/${id}/pdf`,
          note: "Use this URL to download the PDF. Requires Authorization header with Bearer token.",
        };
        break;
      }

      case "add_wallet": {
        const { address, chain, label } = args as {
          address: string;
          chain: string;
          label?: string;
        };
        result = await apiRequest("POST", "/wallets", {
          address,
          chain,
          label,
        });
        break;
      }

      case "list_wallets": {
        const { page, limit } = args as { page?: number; limit?: number };
        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", page.toString());
        if (limit) queryParams.append("limit", limit.toString());
        const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
        result = await apiRequest("GET", `/wallets${query}`);
        break;
      }

      case "remove_wallet": {
        const { id } = args as { id: string };
        result = await apiRequest("DELETE", `/wallets?id=${id}`);
        break;
      }

      case "get_usage": {
        const { userId } = args as { userId: string };
        result = await apiRequest("GET", `/usage?userId=${userId}`);
        break;
      }

      case "get_payment_status": {
        const { id } = args as { id: string };
        result = await apiRequest("GET", `/invoices/${id}`);
        break;
      }

      case "watch_invoice_payment": {
        const { invoiceId } = args as { invoiceId: string };
        // Trigger the payment watch cron job for this specific invoice
        result = await apiRequest("GET", `/cron/payment-watch?invoiceId=${invoiceId}`);
        break;
      }

      case "list_recent_payments": {
        const { limit } = args as { limit?: number };
        // Get invoices with receipts (payments) ordered by most recent
        const queryParams = new URLSearchParams();
        queryParams.append("status", "paid");
        if (limit) queryParams.append("limit", limit.toString());
        result = await apiRequest("GET", `/invoices?${queryParams.toString()}`);
        break;
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      content: [
        {
          type: "text",
          text: `Error: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CryptoClerks MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
