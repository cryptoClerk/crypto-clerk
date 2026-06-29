'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ReceiptPreview from './ReceiptPreview';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TransactionData {
  txHash: string;
  chain: string;
  chainName: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  token: string;
  usdValue: string;
  date: string;
  blockNumber: string;
  gasUsed?: string;
  gasPrice?: string;
}

interface ReceiptData extends TransactionData {
  id: string;
  clientName: string;
  description: string;
  createdAt: string;
}

const FREE_TIER_LIMIT = 5;
const STORAGE_KEY = 'cryptobooks_receipt_count';

function getReceiptCount(): number {
  if (typeof window === 'undefined') return 0;
  const count = localStorage.getItem(STORAGE_KEY);
  return count ? parseInt(count, 10) : 0;
}

function incrementReceiptCount(): void {
  if (typeof window === 'undefined') return;
  const count = getReceiptCount();
  localStorage.setItem(STORAGE_KEY, (count + 1).toString());
}

export default function ReceiptGenerator() {
  const [txHash, setTxHash] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [error, setError] = useState('');
  const [receiptCount, setReceiptCount] = useState(0);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    setReceiptCount(getReceiptCount());
  }, []);

  const handleFetchTransaction = useCallback(async () => {
    if (!txHash.trim()) {
      setError('Please enter a transaction hash');
      return;
    }

    setFetching(true);
    setError('');
    setTransactionData(null);

    try {
      const res = await fetch('/api/transactions/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash: txHash.trim(), chain }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch transaction');
      }

      setTransactionData(data.data);
      setChain(data.data.chain);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setTransactionData(null);
    } finally {
      setFetching(false);
    }
  }, [txHash, chain]);

  const handleGenerate = async () => {
    if (!transactionData) {
      setError('Please fetch a transaction first');
      return;
    }
    if (!clientName.trim() || !description.trim()) {
      setError('Please fill in client name and description');
      return;
    }

    // Check free tier limit
    const count = getReceiptCount();
    if (count >= FREE_TIER_LIMIT) {
      setShowLimitWarning(true);
      return;
    }

    setLoading(true);
    setError('');
    setShowLimitWarning(false);

    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash: transactionData.txHash,
          chain: transactionData.chain,
          clientName,
          description,
          businessName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate receipt');
      }

      const receiptData: ReceiptData = {
        ...transactionData,
        id: data.receipt.id,
        clientName,
        description,
        createdAt: data.receipt.createdAt,
      };

      setReceipt(receiptData);
      incrementReceiptCount();
      setReceiptCount(getReceiptCount());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!receipt) return;

    setGeneratingPDF(true);
    try {
      const element = document.getElementById('receipt-preview');
      if (!element) {
        throw new Error('Receipt preview not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`receipt-${receipt.txHash.slice(0, 8)}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF. Try using Print to PDF instead.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const remainingReceipts = Math.max(0, FREE_TIER_LIMIT - receiptCount);

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
          {/* Transaction Hash Input */}
          <div className="space-y-2">
            <Label htmlFor="txHash">Transaction Hash</Label>
            <div className="flex gap-2">
              <Input
                id="txHash"
                placeholder="0xabc123..."
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                disabled={fetching || loading}
                className="flex-1"
              />
              <Button
                onClick={handleFetchTransaction}
                disabled={fetching || !txHash.trim()}
                variant="secondary"
              >
                {fetching ? 'Fetching...' : 'Fetch'}
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Try: 0xabc123def4567890123456789012345678901234567890123456789012345678
            </p>
          </div>

          {/* Chain Selection */}
          <div className="space-y-2">
            <Label htmlFor="chain">Chain</Label>
            <Select value={chain} onValueChange={(value) => value && setChain(value)} disabled={fetching || loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="bsc">BSC</SelectItem>
                <SelectItem value="arbitrum">Arbitrum</SelectItem>
                <SelectItem value="optimism">Optimism</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Data Preview */}
          {transactionData && (
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-slate-700">Transaction Found</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-500">Amount:</span>{' '}
                  <span className="font-semibold">
                    {transactionData.amount} {transactionData.token}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">USD Value:</span>{' '}
                  <span className="font-semibold">≈ ${transactionData.usdValue}</span>
                </div>
                <div>
                  <span className="text-slate-500">From:</span>{' '}
                  <span className="font-mono text-xs">
                    {transactionData.fromAddress.slice(0, 6)}...
                    {transactionData.fromAddress.slice(-4)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Date:</span>{' '}
                  <span>{new Date(transactionData.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Receipt Details Form */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                placeholder="Acme DAO"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
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

          {/* Free Tier Counter */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">
              {receiptCount} of {FREE_TIER_LIMIT} free receipts used
            </span>
            {remainingReceipts > 0 && (
              <span className="text-blue-600">{remainingReceipts} remaining</span>
            )}
          </div>

          {showLimitWarning && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
              <p className="text-sm text-amber-800">
                You've reached the free limit of {FREE_TIER_LIMIT} receipts.
                Sign up for Pro ($19/mo) for unlimited receipts.
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button
            onClick={handleGenerate}
            disabled={loading || !transactionData}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Generating...' : 'Generate Receipt'}
          </Button>
        </CardContent>
      </Card>

      {/* Receipt Preview */}
      {receipt && (
        <div className="space-y-4">
          <div id="receipt-preview">
            <ReceiptPreview receipt={receipt} businessName={businessName} />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadPDF}
              disabled={generatingPDF}
              className="flex-1"
            >
              {generatingPDF ? 'Generating PDF...' : 'Download PDF'}
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              className="flex-1"
            >
              Print Receipt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
