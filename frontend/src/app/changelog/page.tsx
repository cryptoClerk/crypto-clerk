import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChangelogEntry {
  date: string;
  version: string;
  changes: string[];
  type: "feature" | "fix" | "improvement";
}

const changelog: ChangelogEntry[] = [
  {
    date: "2026-07-01",
    version: "1.0.0",
    type: "feature",
    changes: [
      "Launched invoice payment detection system - auto-detect blockchain payments",
      "Added public invoice pages with QR codes - customers can pay without creating an account",
      "Built auto-receipt generator - receipts created automatically when payment detected",
      "Implemented invoice matching engine - matches payments to invoices by address, amount, token",
      "Added payment status tracking - pending, partial, paid, overpaid states",
      "Created dashboard PaymentTracker - see all unpaid invoices at a glance",
      "Added ShareInvoiceButton - copy public link or view public page",
      "Updated invoice PDFs with payment status and payment address display",
      "Integrated Resend email service - notifications when payments arrive",
      "Published MCP server with 14 tools for AI agent integration",
      "Added Getting Started guide and Pricing page",
      "Rebranded to CryptoClerks",
    ],
  },
  {
    date: "2026-06-30",
    version: "0.9.0",
    type: "feature",
    changes: [
      "Added statement PDF generation with multi-page support",
      "Built API v1 with API key authentication",
      "Created API documentation with interactive examples",
      "Added usage tracking and rate limits",
      "Implemented statement history storage",
      "Built wallet management system",
    ],
  },
  {
    date: "2026-06-29",
    version: "0.8.0",
    type: "feature",
    changes: [
      "Launched invoice creation with PDF generation",
      "Added payment status tracking (pending, paid, overdue)",
      "Implemented invoice polling for manual payment verification",
      "Built multi-chain support (Ethereum, Polygon, BSC, Arbitrum, Optimism, Base)",
    ],
  },
  {
    date: "2026-06-28",
    version: "0.7.0",
    type: "feature",
    changes: [
      "Launched receipt generation from transaction hashes",
      "Added ERC-20 token parsing for USDC, USDT, DAI",
      "Implemented USD value calculation via CoinGecko",
      "Built PDF receipt generation with professional layout",
      "Added free tier with 5 receipts/month",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4">Changelog</h1>
      <p className="text-slate-600 mb-8">
        Track the latest updates and improvements to CryptoClerks.
      </p>

      <div className="space-y-6">
        {changelog.map((entry, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Version {entry.version}</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{entry.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    entry.type === "feature"
                      ? "bg-blue-100 text-blue-800"
                      : entry.type === "fix"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {entry.changes.map((change, changeIndex) => (
                  <li key={changeIndex} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-blue-500 mt-1">•</span>
                    {change}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
