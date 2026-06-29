import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
          <p className="text-lg md:text-xl text-slate-300 mb-10">
            Generate professional receipts, bank-style statements, and invoices from your blockchain transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Try it free — no signup required
            </Button>
          </div>
        </div>
      </div>

      {/* Receipt Generator */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        <ReceiptGenerator />
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What you get</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Receipts</CardTitle>
              <CardDescription>
                Paste a transaction hash, fill in details, download a professional PDF receipt in 30 seconds.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Statements</CardTitle>
              <CardDescription>
                Monthly bank-style statements from your wallet history. Proof of income for landlords, lenders, accountants.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                Coming soon: Branded invoices with crypto payment links. Get paid in USDC, USDT, or DAI.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-slate-400 py-8 px-4 text-center">
        <p>CryptoBooks — Built for freelancers who get paid in crypto.</p>
      </div>
    </div>
  );
}
