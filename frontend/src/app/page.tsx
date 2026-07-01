import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ReceiptGenerator from "@/components/receipts/ReceiptGenerator";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Financial docs for freelancers paid in crypto
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Generate professional receipts, bank-style statements, and invoices from your blockchain transactions. No more Etherscan screenshots.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
              Try it free — no signup required
            </Button>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 text-lg px-8">
                Dashboard
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-400 mt-4">
            ✓ Free tier: 5 receipts/month • ✓ No credit card required
          </p>
        </div>
      </div>

      {/* Demo / Receipt Generator */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Generate your first receipt in 30 seconds</h2>
          <p className="text-slate-600">Paste a transaction hash, fill in details, done.</p>
        </div>
        <ReceiptGenerator />
      </div>

      {/* Features */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <CardTitle>Receipts</CardTitle>
                <CardDescription>
                  Paste a transaction hash, fill in details, download a professional PDF receipt in 30 seconds.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <CardTitle>Statements</CardTitle>
                <CardDescription>
                  Monthly bank-style statements from your wallet history. Proof of income for landlords, lenders, accountants.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>
                  Branded invoices with crypto payment links. Get paid in USDC, USDT, or DAI.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2">Paste Transaction</h3>
              <p className="text-slate-600">Copy your tx hash from Etherscan, MetaMask, or any wallet.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2">Add Details</h3>
              <p className="text-slate-600">Fill in client name and what the payment was for.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2">Download PDF</h3>
              <p className="text-slate-600">Get a professional receipt you can send to your accountant.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
          <p className="text-center text-slate-600 mb-12">Start free. Upgrade when you need more.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Free</CardTitle>
                <div className="text-3xl font-bold">$0</div>
                <CardDescription>Forever free</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 5 receipts/month</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 5 statements/month</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 3 wallets</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Basic branding</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">Most Popular</div>
              <CardHeader>
                <CardTitle className="text-xl">Pro</CardTitle>
                <div className="text-3xl font-bold">$19<span className="text-lg font-normal text-slate-500">/mo</span></div>
                <CardDescription>For active freelancers</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Unlimited receipts</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Unlimited statements</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Unlimited wallets</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Custom branding</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> CSV export</li>
                </ul>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">Upgrade to Pro</Button>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Business</CardTitle>
                <div className="text-3xl font-bold">$49<span className="text-lg font-normal text-slate-500">/mo</span></div>
                <CardDescription>For teams & agencies</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Everything in Pro</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Multi-user (up to 5)</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> White-label PDFs</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> API access</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Priority support</li>
                </ul>
                <Button variant="outline" className="w-full mt-6">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Do you store my private keys?</h3>
              <p className="text-slate-600">No. We only store public wallet addresses. We never ask for private keys or seed phrases.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Is my transaction data private?</h3>
              <p className="text-slate-600">Blockchain data is public by nature. We only access what is already public. Your labels and descriptions are private to your account.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How accurate are the USD values?</h3>
              <p className="text-slate-600">We use historical price data. Values are approximate and for reference only. Consult your tax professional for exact figures.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What chains do you support?</h3>
              <p className="text-slate-600">Currently Ethereum, Polygon, BSC, Arbitrum, and Optimism. More chains coming soon.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I use this for tax filing?</h3>
              <p className="text-slate-600">Our reports are designed to help you and your accountant. We are not tax software and do not provide tax advice.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I get a refund?</h3>
              <p className="text-slate-600">Pro and Business subscriptions can be canceled anytime. We offer refunds within 7 days of purchase if you're not satisfied.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get organized?</h2>
          <p className="text-blue-100 mb-8">Start generating professional receipts and statements today.</p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8">
            Try it free — no signup required
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">CryptoBooks</h3>
            <p className="text-sm">Financial docs for freelancers paid in crypto.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Receipts</Link></li>
              <li><Link href="/dashboard/statements" className="hover:text-white">Statements</Link></li>
              <li><Link href="/dashboard/invoices" className="hover:text-white">Invoices</Link></li>
              <li><Link href="/help" className="hover:text-white">Help Docs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Twitter</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a></li>
              <li><a href="mailto:support@cryptobooks.app" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-8 pt-8 border-t border-slate-800 text-center text-sm">
          <p>© 2025 CryptoBooks. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
