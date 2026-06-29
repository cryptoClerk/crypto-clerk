import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm">← Back to home</Link>
          <h1 className="text-3xl font-bold mt-4">Help Center</h1>
          <p className="text-slate-300 mt-2">Everything you need to know about using CryptoBooks.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">How to generate a receipt</h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-600">
                <li>Copy your transaction hash from Etherscan, MetaMask, or your wallet.</li>
                <li>Paste it into the transaction hash field on the homepage.</li>
                <li>Click "Fetch" to pull transaction details.</li>
                <li>Enter the client name and description of work.</li>
                <li>Click "Generate Receipt" and download your PDF.</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Receipts */}
        <Card>
          <CardHeader>
            <CardTitle>Receipts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">What is a receipt?</h3>
              <p className="text-slate-600">
                A receipt is proof that you received a payment. In CryptoBooks, receipts are generated from
                blockchain transactions and include details like amount, date, sender, and a description of the work.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What transaction hashes work?</h3>
              <p className="text-slate-600">
                We support ERC-20 token transfers (USDC, USDT, DAI, etc.) on Ethereum, Polygon, BSC, Arbitrum, and Optimism.
                Make sure your transaction is a token transfer, not just an ETH transfer.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How many receipts can I generate?</h3>
              <p className="text-slate-600">
                Free tier: 5 receipts per month. Pro tier: unlimited.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Statements */}
        <Card>
          <CardHeader>
            <CardTitle>Statements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">How to generate a statement</h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-600">
                <li>Go to the <Link href="/dashboard/wallets" className="text-blue-600 hover:underline">Wallets</Link> page and add your wallet addresses.</li>
                <li>Navigate to <Link href="/dashboard/statements" className="text-blue-600 hover:underline">Statements</Link>.</li>
                <li>Select the wallets you want to include.</li>
                <li>Choose a date range (This Month, Last Month, or Custom).</li>
                <li>Click "Generate Statement" and download your PDF or CSV.</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What is a statement used for?</h3>
              <p className="text-slate-600">
                Statements show your crypto income over a period of time. They're useful for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 mt-2">
                <li>Proving income to landlords for apartment applications</li>
                <li>Providing documentation for loan applications</li>
                <li>Organizing transactions for your accountant at tax time</li>
                <li>Visa/immigration financial proof</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I export to CSV?</h3>
              <p className="text-slate-600">
                Yes! After generating a statement, click "Export CSV" to download a spreadsheet with all transactions.
                CSV export is available on all tiers.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Supported Chains */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Chains & Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Blockchains</h3>
                <ul className="space-y-1 text-slate-600">
                  <li>Ethereum</li>
                  <li>Polygon</li>
                  <li>BSC (Binance Smart Chain)</li>
                  <li>Arbitrum</li>
                  <li>Optimism</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tokens</h3>
                <ul className="space-y-1 text-slate-600">
                  <li>USDC</li>
                  <li>USDT</li>
                  <li>DAI</li>
                  <li>Any ERC-20 token</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Is there a free tier?</h3>
              <p className="text-slate-600">
                Yes! The free tier includes 5 receipts and 5 statements per month, up to 3 wallets.
                No credit card required.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What's included in Pro?</h3>
              <p className="text-slate-600">
                Pro ($19/month) includes unlimited receipts, unlimited statements, unlimited wallets,
                custom branding on your PDFs, and CSV export.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What's included in Business?</h3>
              <p className="text-slate-600">
                Business ($49/month) includes everything in Pro plus multi-user access (up to 5 team members),
                white-label PDFs (remove CryptoBooks branding), API access, and priority support.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle>Security & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Do you store my private keys?</h3>
              <p className="text-slate-600">
                No. We only store public wallet addresses. We never ask for private keys, seed phrases,
                or any information that could access your funds.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is my data private?</h3>
              <p className="text-slate-600">
                Blockchain transaction data is public by nature. We only access what is already publicly available.
                Your labels, descriptions, and account information are private and encrypted.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Need more help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Can't find what you're looking for? Reach out and we'll help.
            </p>
            <div className="flex gap-4">
              <a href="mailto:support@cryptobooks.app">
                <Button variant="outline">Email Support</Button>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">Twitter / X</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-slate-400 py-8 px-4 text-center">
        <p>© 2025 CryptoBooks. All rights reserved.</p>
      </div>
    </div>
  );
}
