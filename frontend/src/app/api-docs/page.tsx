import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
      <p className="text-slate-600 mb-8">
        Programmatic access to CryptoBooks for AI agents and integrations.
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

        <Card>
          <CardHeader>
            <CardTitle>Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">POST /receipts</h3>
              <p className="text-slate-600 text-sm mb-2">Fetch transaction details by hash</p>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST https://crypto-clerk.onrender.com/api/v1/receipts \\
  -H "Authorization: Bearer cb_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"txHash": "0x...", "chain": "ethereum"}'`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-lg">POST /statements</h3>
              <p className="text-slate-600 text-sm mb-2">Generate a bank-style statement</p>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST https://crypto-clerk.onrender.com/api/v1/statements \\
  -H "Authorization: Bearer cb_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "walletAddresses": ["0x..."],
    "startDate": "2026-01-01",
    "endDate": "2026-06-30",
    "chain": "ethereum"
  }'`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-lg">POST /invoices</h3>
              <p className="text-slate-600 text-sm mb-2">Create a new invoice</p>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST https://crypto-clerk.onrender.com/api/v1/invoices \\
  -H "Authorization: Bearer cb_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "clientName": "Acme Corp",
    "amount": "5000",
    "token": "USDC",
    "dueDate": "2026-07-15"
  }'`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-lg">GET /invoices</h3>
              <p className="text-slate-600 text-sm mb-2">List all invoices</p>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`curl https://crypto-clerk.onrender.com/api/v1/invoices \\
  -H "Authorization: Bearer cb_your_key"`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Format</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">All responses follow this format:</p>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "success": true,
  "data": { ... }
}

// Error
{
  "error": "Error message"
}`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rate Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>Free tier: 30 requests/minute</li>
              <li>Pro tier: 120 requests/minute</li>
              <li>Business tier: 300 requests/minute</li>
            </ul>
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
