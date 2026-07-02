import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GettingStartedPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4">Getting Started</h1>
      <p className="text-slate-600 mb-8">
        Everything you need to start using CryptoClerks for your crypto business.
      </p>

      <div className="space-y-6">
        {/* Step 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Create Your Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Sign up with your email or Google account. No credit card required for the free tier.
            </p>
            <Link href="/">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Generate Your First Receipt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Paste any transaction hash from Etherscan (or any supported chain). Add client details. Get a professional PDF receipt instantly.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 mb-4">
              <li>Go to the homepage</li>
              <li>Paste a transaction hash (0x...)</li>
              <li>Select the chain (Ethereum, Polygon, etc.)</li>
              <li>Enter client name and description</li>
              <li>Click Generate</li>
            </ol>
            <Link href="/">
              <Button variant="outline">Try It Now</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Create an Invoice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Send professional invoices to your clients. Include a payment QR code so they can pay directly from their wallet.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 mb-4">
              <li>Go to Dashboard → Invoices</li>
              <li>Click "Create Invoice"</li>
              <li>Enter client details, amount, and token</li>
              <li>Add your payment wallet address</li>
              <li>Share the public link or QR code with your client</li>
            </ol>
            <Link href="/dashboard/invoices">
              <Button variant="outline">Create Invoice</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              Track Payments Automatically
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              When your client pays the invoice, CryptoClerks automatically detects the payment on the blockchain and generates a receipt. No manual work needed.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
              <li>Payment detected via blockchain monitoring</li>
              <li>Receipt auto-generated and linked to invoice</li>
              <li>Invoice status updated (pending → paid)</li>
              <li>Email notification sent (if configured)</li>
            </ul>
          </CardContent>
        </Card>

        {/* Step 5 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
              Generate Statements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Create bank-style statements from your wallet history for accounting or tax purposes.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 mb-4">
              <li>Go to Dashboard → Statements</li>
              <li>Add your wallet addresses</li>
              <li>Select date range</li>
              <li>Generate statement (PDF or CSV)</li>
            </ol>
            <Link href="/dashboard/statements">
              <Button variant="outline">Generate Statement</Button>
            </Link>
          </CardContent>
        </Card>

        {/* API Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
              API Access (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Integrate CryptoClerks into your workflow or AI agents with our REST API.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 mb-4">
              <li>Generate receipts programmatically</li>
              <li>Create invoices from your app</li>
              <li>Fetch statements for reporting</li>
              <li>MCP server for AI agents</li>
            </ul>
            <Link href="/api-docs">
              <Button variant="outline">View API Docs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-500 mb-4">Need help?</p>
        <a href="mailto:support@cryptoclerks.com" className="text-blue-600 hover:underline">
          Contact support
        </a>
      </div>
    </div>
  );
}
