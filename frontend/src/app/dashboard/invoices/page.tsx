'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, FileText } from 'lucide-react';
import Link from 'next/link';

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string | null;
  amount: string;
  token: string;
  status: string;
  dueDate: string | null;
  paymentTxHash: string | null;
  createdAt: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [token, setToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/invoices');
      const data = await res.json();
      if (data.success) {
        setInvoices(data.data);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientEmail,
          amount,
          token,
          dueDate,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInvoices([data.data, ...invoices]);
        setShowCreate(false);
        resetForm();
      } else {
        alert('Failed to create invoice');
      }
    } catch (err) {
      console.error('Error creating invoice:', err);
      alert('Error creating invoice');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setClientName('');
    setClientEmail('');
    setToken('USDC');
    setAmount('');
    setDueDate('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-slate-600 mt-1">
            Create professional invoices for your clients.
          </p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          {showCreate ? 'Cancel' : 'Create Invoice'}
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Acme Corp"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Client Email (optional)</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="billing@acme.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Token</Label>
                  <select
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white"
                  >
                    <option value="USDC">USDC</option>
                    <option value="USDT">USDT</option>
                    <option value="DAI">DAI</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="5000.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-slate-600">
                  <div>Total: <strong className="text-lg">{amount || '0'} {token}</strong></div>
                </div>
                <Button
                  type="submit"
                  disabled={loading || !amount}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Creating...' : 'Create Invoice'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {fetching ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-500">Loading invoices...</p>
          </CardContent>
        </Card>
      ) : invoices.length > 0 ? (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{invoice.clientName}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {invoice.invoiceNumber} • {invoice.amount} {invoice.token}
                      </p>
                      {invoice.dueDate && (
                        <p className="text-sm text-slate-500">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/invoices/${invoice.id}`}>
                      <Button variant="outline">View</Button>
                    </Link>
                    {invoice.status === 'pending' && (
                      <Button
                        variant="outline"
                        className="text-green-600"
                        onClick={() => {/* mark as paid */}}
                      >
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600">No invoices yet</h3>
            <p className="text-slate-500 mt-1">
              Create your first invoice to bill a client in crypto.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
