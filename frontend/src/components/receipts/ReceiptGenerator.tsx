'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ReceiptPreview from './ReceiptPreview';

interface ReceiptData {
  id: string;
  txHash: string;
  chain: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  token: string;
  usdValue: string;
  clientName: string;
  description: string;
  date: string;
  createdAt: string;
}

export default function ReceiptGenerator() {
  const [txHash, setTxHash] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!txHash.trim()) {
      setError('Please enter a transaction hash');
      return;
    }
    if (!clientName.trim() || !description.trim()) {
      setError('Please fill in client name and description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash: txHash.trim(),
          chain,
          clientName,
          description,
          businessName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate receipt');
      }

      setReceipt(data.receipt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!receipt) return;
    // TODO: Implement PDF generation with html2canvas + jsPDF
    // For now, just print the receipt page
    window.print();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Receipt</CardTitle>
          <CardDescription>
            Paste a transaction hash and fill in the details to create a professional receipt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="txHash">Transaction Hash</Label>
            <Input
              id="txHash"
              placeholder="0xabc123..."
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-slate-500">
              Try: 0xabc123def4567890123456789012345678901234567890123456789012345678
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                placeholder="Acme DAO"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Landing page design"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessName">Your Business Name (optional)</Label>
            <Input
              id="businessName"
              placeholder="Alex Design Co"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Generating...' : 'Generate Receipt'}
          </Button>
        </CardContent>
      </Card>

      {receipt && (
        <div className="space-y-4">
          <ReceiptPreview receipt={receipt} businessName={businessName} />
          <Button onClick={handleDownload} className="w-full">
            Download PDF (Print to PDF)
          </Button>
        </div>
      )}
    </div>
  );
}
