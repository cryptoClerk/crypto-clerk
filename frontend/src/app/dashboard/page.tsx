'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentTracker from '@/components/dashboard/PaymentTracker';
import AnalyticsDashboard from '@/components/dashboard/AnalyticsDashboard';

interface UsageData {
  receipts: { used: number; limit: number; remaining: number };
  statements: { used: number; limit: number; remaining: number };
  invoices: { used: number; limit: number; remaining: number };
  plan: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: string;
  token: string;
  status: string;
  paidAmount: string;
  remainingAmount: string;
  paymentAddress: string | null;
  createdAt: string;
  receipts: Array<any>;
}

export default function DashboardPage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
    fetchInvoices();
    fetchAnalytics();
  }, []);

  const fetchUsage = async () => {
    try {
      // For demo, using a mock userId. In production, get from auth context
      const res = await fetch('/api/usage?userId=demo-user');
      const data = await res.json();
      if (data.success) {
        setUsage(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch usage:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/invoices?userId=demo-user');
      const data = await res.json();
      if (data.success) {
        setInvoices(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics?userId=demo-user');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  const isUnlimited = (limit: number) => limit === Infinity || limit >= 9999;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-slate-500">
          Plan: <span className="capitalize font-medium">{usage?.plan || 'free'}</span>
        </div>
      </div>
      
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
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Create professional invoices for your clients.
            </p>
            <Link href="/dashboard/invoices">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Create Invoice
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

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          ) : usage ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{usage.receipts.used}</p>
                <p className="text-sm text-slate-500">Receipts</p>
                {!isUnlimited(usage.receipts.limit) && (
                  <p className="text-xs text-slate-400">{usage.receipts.remaining} remaining</p>
                )}
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{usage.statements.used}</p>
                <p className="text-sm text-slate-500">Statements</p>
                {!isUnlimited(usage.statements.limit) && (
                  <p className="text-xs text-slate-400">{usage.statements.remaining} remaining</p>
                )}
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{usage.invoices.used}</p>
                <p className="text-sm text-slate-500">Invoices</p>
                {!isUnlimited(usage.invoices.limit) && (
                  <p className="text-xs text-slate-400">{usage.invoices.remaining} remaining</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-slate-500">Failed to load usage data</p>
          )}
        </CardContent>
      </Card>

      {/* Payment Tracker */}
      <PaymentTracker invoices={invoices} />

      {/* Analytics Overview */}
      {analytics && (
        <AnalyticsDashboard data={analytics} />
      )}
    </div>
  );
}
