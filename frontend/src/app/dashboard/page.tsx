import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Generate professional receipts from individual transactions.
            </p>
            <Link href="/">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Generate Receipt
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Create bank-style statements from your wallet history.
            </p>
            <Link href="/dashboard/statements">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Generate Statement
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Manage your connected crypto wallets.
            </p>
            <Link href="/dashboard/wallets">
              <Button variant="outline" className="w-full">
                Manage Wallets
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-sm text-slate-500">Receipts Generated</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-sm text-slate-500">Statements Generated</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-sm text-slate-500">Wallets Connected</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">Free</p>
              <p className="text-sm text-slate-500">Current Plan</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
