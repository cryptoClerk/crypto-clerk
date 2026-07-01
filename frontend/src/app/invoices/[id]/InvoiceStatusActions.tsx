'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, CreditCard } from 'lucide-react';

interface Invoice {
  id: string;
  status: string;
  paymentTxHash: string | null;
}

export default function InvoiceStatusActions({ invoice }: { invoice: Invoice }) {
  const [showPayForm, setShowPayForm] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMarkPaid = async () => {
    if (!txHash.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentTxHash: txHash.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        window.location.reload();
      } else {
        alert('Failed to update invoice');
      }
    } catch (err) {
      console.error('Error updating invoice:', err);
      alert('Error updating invoice');
    } finally {
      setLoading(false);
    }
  };

  if (invoice.status === 'paid') {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">Paid</span>
      </div>
    );
  }

  if (showPayForm) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          placeholder="0x..."
          className="w-64 text-xs font-mono"
        />
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={handleMarkPaid}
          disabled={loading}
        >
          {loading ? '...' : 'Confirm'}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowPayForm(false)}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      className="text-green-600"
      onClick={() => setShowPayForm(true)}
    >
      <CreditCard className="w-4 h-4 mr-2" />
      Mark as Paid
    </Button>
  );
}
