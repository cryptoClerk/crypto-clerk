import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Simple Pricing</h1>
      <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
        Start free. Upgrade when you need more. No hidden fees, no transaction costs.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Free Tier */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>For individuals getting started</CardDescription>
            <div className="text-3xl font-bold mt-2">$0<span className="text-sm font-normal text-slate-500">/month</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">5 receipts/month</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">3 statements/month</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">5 invoices/month</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">6 chains supported</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">Basic PDF receipts</span>
              </li>
            </ul>
            <Link href="/dashboard">
              <Button className="w-full" variant="outline">Get Started</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pro Tier */}
        <Card className="border-2 border-blue-500 relative">
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-3 py-1 rounded-bl-lg">Popular</div>
          <CardHeader>
            <CardTitle className="text-2xl">Pro</CardTitle>
            <CardDescription>For active freelancers</CardDescription>
            <div className="text-3xl font-bold mt-2">$19<span className="text-sm font-normal text-slate-500">/month</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">Unlimited receipts</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">Unlimited statements</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">Unlimited invoices</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">Branded PDFs (your logo)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">Auto payment detection</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">Email notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">API access</span>
              </li>
            </ul>
            <Link href="/dashboard">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Upgrade to Pro</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Business Tier */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl">Business</CardTitle>
            <CardDescription>For teams and agencies</CardDescription>
            <div className="text-3xl font-bold mt-2">$49<span className="text-sm font-normal text-slate-500">/month</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">Everything in Pro</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">5 team members</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">Custom integrations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">Priority support</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm">White-label option</span>
              </li>
            </ul>
            <Link href="/dashboard">
              <Button className="w-full" variant="outline">Contact Sales</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-500 text-sm">
          No transaction fees. No hidden costs. You keep 100% of your crypto payments.
        </p>
      </div>
    </div>
  );
}
