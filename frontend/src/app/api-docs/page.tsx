import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
      <p className="text-slate-600 mb-8">
        Complete API reference for CryptoClerks. AI agents and developers can access every feature programmatically.
      </p>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">All API requests require an API key in the Authorization header:</p>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
{`Authorization: Bearer cb_your_api_key_here`}
            </pre>
            <p className="mt-4 text-sm text-slate-500">
              Generate API keys from your dashboard. Keys are shown once — keep them secure.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Base URL</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg">
{`https://crypto-clerk.onrender.com/api/v1`}
            </pre>
          </CardContent>
        </Card>

        <Tabs defaultValue="receipts">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
            <TabsTrigger value="statements">Statements</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="receipts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>POST /receipts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Generate a professional receipt from a blockchain transaction hash.</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Request Body</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "txHash": "0x7f8c9d2e...a1b2c3d4",  // Required. 66-char hex transaction hash
  "chain": "ethereum",                    // Required. "ethereum" | "polygon" | "bsc" | "arbitrum" | "optimism" | "base"
  "clientName": "Acme Corp",              // Required. Who paid you
  "description": "Website design work",   // Required. What the payment was for
  "businessName": "My Freelance LLC",     // Optional. Your business name
  "businessAddress": "123 Main St"        // Optional. Your business address
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Success Response (200)</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "txHash": "0x7f8c9d2e...a1b2c3d4",
    "chain": "ethereum",
    "fromAddress": "0x1234...5678",
    "toAddress": "0xabcd...efgh",
    "amount": "1500.00",
    "token": "USDC",
    "usdValue": "1500.00",
    "clientName": "Acme Corp",
    "description": "Website design work",
    "businessName": "My Freelance LLC",
    "businessAddress": "123 Main St",
    "date": "2026-06-15T10:30:00.000Z",
    "createdAt": "2026-07-01T18:00:00.000Z"
  },
  "usdIsEstimated": false  // true if we couldn't get a real USD price
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Error Response (400)</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "error": [
    {
      "path": ["txHash"],
      "message": "Invalid transaction hash format. Must be 0x followed by 64 hex characters."
    }
  ]
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Error Response (403)</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "error": "Free tier limit reached. Upgrade to Pro for unlimited receipts.",
  "errorType": "FREE_TIER_LIMIT",
  "limit": 5,
  "current": 5
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>POST /statements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Generate a bank-style statement from wallet addresses for a date range.</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Request Body</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "walletAddresses": ["0x1234...5678", "0xabcd...efgh"],  // Required. Array of wallet addresses
  "startDate": "2026-01-01",                                // Optional. YYYY-MM-DD format
  "endDate": "2026-06-30",                                  // Optional. YYYY-MM-DD format
  "chain": "ethereum"                                       // Optional. Default: "ethereum"
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Success Response (200)</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "success": true,
  "data": {
    "transactions": [
      {
        "txHash": "0x7f8c9d2e...a1b2c3d4",
        "date": "2026-06-15T10:30:00.000Z",
        "from": "0x1234...5678",
        "to": "0xabcd...efgh",
        "amount": "1500.00",
        "token": "USDC",
        "usdValue": "1500.00",
        "usdIsEstimated": false,
        "priceSource": "coingecko",
        "walletAddress": "0xabcd...efgh"
      }
    ],
    "totalTransactions": 1,
    "pricedTransactions": 1,
    "totalIncome": "1500.00",
    "walletCount": 2,
    "startDate": "2026-01-01",
    "endDate": "2026-06-30"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GET /statements/history</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Get previously generated statements.</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Query Parameters</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`?limit=20  // Optional. Default: 20, Max: 100`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Success Response (200)</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "startDate": "2026-01-01",
      "endDate": "2026-06-30",
      "chain": "ethereum",
      "totalTransactions": 15,
      "totalIncome": "15000.00",
      "walletCount": 2,
      "createdAt": "2026-07-01T18:00:00.000Z"
    }
  ]
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>POST /invoices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Create a new invoice.</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Request Body</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "clientName": "Acme Corp",        // Required. Who you're invoicing
  "clientEmail": "client@acme.com",  // Optional. For sending notifications
  "amount": "5000.00",               // Required. Amount as string (preserve decimals)
  "token": "USDC",                   // Required. Token symbol: "USDC" | "USDT" | "DAI" | "ETH" | etc.
  "dueDate": "2026-07-15"            // Optional. YYYY-MM-DD format
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Success Response (200)</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "invoiceNumber": "INV-260701-0001",
    "clientName": "Acme Corp",
    "clientEmail": "client@acme.com",
    "amount": "5000.00",
    "token": "USDC",
    "dueDate": "2026-07-15T00:00:00.000Z",
    "status": "pending",
    "paymentTxHash": null,
    "createdAt": "2026-07-01T18:00:00.000Z"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GET /invoices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>List all invoices.</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Success Response (200)</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "invoiceNumber": "INV-260701-0001",
      "clientName": "Acme Corp",
      "clientEmail": "client@acme.com",
      "amount": "5000.00",
      "token": "USDC",
      "dueDate": "2026-07-15T00:00:00.000Z",
      "status": "pending",  // "pending" | "paid" | "overdue" | "cancelled"
      "paymentTxHash": null,
      "createdAt": "2026-07-01T18:00:00.000Z"
    }
  ]
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GET /invoices/:id</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Get a specific invoice by ID.</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Success Response (200)</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "invoiceNumber": "INV-260701-0001",
    "clientName": "Acme Corp",
    "clientEmail": "client@acme.com",
    "amount": "5000.00",
    "token": "USDC",
    "dueDate": "2026-07-15T00:00:00.000Z",
    "status": "pending",
    "paymentTxHash": null,
    "paymentAddress": "0xYourWalletAddressHere",
    "paymentLink": "https://crypto-clerk.onrender.com/invoices/550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-07-01T18:00:00.000Z"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GET /invoices/:id/pdf</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Download a PDF version of the invoice.</p>
                <p className="text-sm text-slate-600">Returns a PDF file directly. Use this URL to download or embed the invoice.</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Example</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`curl https://crypto-clerk.onrender.com/api/invoices/550e8400.../pdf \\
  -H "Authorization: Bearer cb_your_key" \\
  --output invoice.pdf`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>POST /wallets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Add a wallet to track for statements.</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Request Body</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "address": "0x1234567890abcdef1234567890abcdef12345678",  // Required. 42-char Ethereum address
  "chain": "ethereum",                                          // Required. "ethereum" | "polygon" | "bsc" | "arbitrum" | "optimism" | "base"
  "label": "Main Wallet"                                        // Optional. Display name for the wallet
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Success Response (200)</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "success": true,
  "wallet": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "address": "0x1234567890abcdef1234567890abcdef12345678",
    "chain": "ethereum",
    "label": "Main Wallet",
    "createdAt": "2026-07-01T18:00:00.000Z"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GET /wallets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>List all connected wallets with pagination.</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Query Parameters</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`?page=1   // Optional. Default: 1
?limit=20  // Optional. Default: 20, Max: 100`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Success Response (200)</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "wallets": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "address": "0x1234567890abcdef1234567890abcdef12345678",
      "chain": "ethereum",
      "label": "Main Wallet",
      "createdAt": "2026-07-01T18:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1,
    "hasMore": false
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>DELETE /wallets?id=:id</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Remove a wallet from tracking.</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Example</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X DELETE "https://crypto-clerk.onrender.com/api/wallets?id=550e8400-e29b-41d4-a716-446655440000" \\
  -H "Authorization: Bearer cb_your_key"`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Success Response (200)</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{ "success": true }`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>POST /statements/pdf</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Generate a PDF from statement data.</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Request Body</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "transactions": [ ... ],  // Same format as returned by POST /statements
  "totalTransactions": 15,
  "totalIncome": "15000.00",
  "walletCount": 2,
  "startDate": "2026-01-01",
  "endDate": "2026-06-30"
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Response</h4>
                  <p className="text-sm text-slate-600 mb-2">Returns a PDF file directly.</p>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST https://crypto-clerk.onrender.com/api/statements/pdf \\
  -H "Authorization: Bearer cb_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"transactions": [...], "totalIncome": "15000.00"}' \\
  --output statement.pdf`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GET /usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Get current usage and limits.</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Query Parameters</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`?userId=your_user_id  // Required`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Success Response (200)</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "success": true,
  "data": {
    "receipts": {
      "used": 3,
      "limit": 5,
      "remaining": 2
    },
    "statements": {
      "used": 1,
      "limit": 5,
      "remaining": 4
    },
    "invoices": {
      "used": 0,
      "limit": 5,
      "remaining": 5
    },
    "plan": "free"  // "free" | "pro" | "business"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Common Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">400 Bad Request</h4>
                <p className="text-sm text-slate-600 mb-2">Invalid input data</p>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{ "error": [ { "path": ["txHash"], "message": "Invalid format" } ] }`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold">401 Unauthorized</h4>
                <p className="text-sm text-slate-600 mb-2">Missing or invalid API key</p>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{ "error": "Missing or invalid Authorization header" }`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold">429 Too Many Requests</h4>
                <p className="text-sm text-slate-600 mb-2">Rate limit exceeded</p>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{ "error": "Rate limit exceeded. Please try again later." }`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Link href="/dashboard">
          <span className="text-blue-600 hover:underline">← Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
