'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import StatementPreview from '@/components/statements/StatementPreview';

interface Wallet {
  id: string;
  address: string;
  chain: string;
  label: string | null;
}

interface Transaction {
  txHash: string;
  date: string;
  from: string;
  to: string;
  amount: string;
  token: string;
  usdValue: string;
  usdIsEstimated?: boolean;
  walletAddress: string;
}

interface StatementData {
  transactions: Transaction[];
  totalTransactions: number;
  totalIncome: string;
  walletCount: number;
  startDate?: string;
  endDate?: string;
}

const DATE_PRESETS = [
  { id: 'this_month', name: 'This Month' },
  { id: 'last_month', name: 'Last Month' },
  { id: 'last_3_months', name: 'Last 3 Months' },
  { id: 'this_year', name: 'This Year' },
  { id: 'last_year', name: 'Last Year' },
  { id: 'custom', name: 'Custom Range' },
];

function getPresetDates(presetId: string): { start: string; end: string } | null {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  switch (presetId) {
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: start.toISOString().split('T')[0], end: today };
    }
    case 'last_month': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
    }
    case 'last_3_months': {
      const start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      return { start: start.toISOString().split('T')[0], end: today };
    }
    case 'this_year': {
      const start = new Date(now.getFullYear(), 0, 1);
      return { start: start.toISOString().split('T')[0], end: today };
    }
    case 'last_year': {
      const start = new Date(now.getFullYear() - 1, 0, 1);
      const end = new Date(now.getFullYear() - 1, 11, 31);
      return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
    }
    default:
      return null;
  }
}

export default function StatementsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [datePreset, setDatePreset] = useState('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [statement, setStatement] = useState<StatementData | null>(null);
  const [error, setError] = useState('');

  const [manualAddress, setManualAddress] = useState('');
  const [useManualAddress, setUseManualAddress] = useState(false);

  const fetchWallets = useCallback(async () => {
    try {
      const res = await fetch('/api/wallets');
      const data = await res.json();
      if (res.ok) {
        setWallets(data.wallets);
      }
    } catch (err) {
      console.error('Failed to fetch wallets:', err);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const toggleWallet = (address: string) => {
    setSelectedWallets((prev) =>
      prev.includes(address)
        ? prev.filter((a) => a !== address)
        : [...prev, address]
    );
  };

  const handleGenerate = async () => {
    const addressesToUse: string[] = [];

    if (useManualAddress && manualAddress.trim()) {
      // Validate Ethereum address
      if (!/^0x[a-fA-F0-9]{40}$/.test(manualAddress.trim())) {
        setError('Invalid Ethereum address format');
        return;
      }
      addressesToUse.push(manualAddress.trim().toLowerCase());
    } else if (selectedWallets.length > 0) {
      addressesToUse.push(...selectedWallets);
    } else {
      setError('Please select at least one wallet or enter an address');
      return;
    }

    let startDate: string | undefined;
    let endDate: string | undefined;

    if (datePreset === 'custom') {
      if (!customStartDate || !customEndDate) {
        setError('Please select both start and end dates');
        return;
      }
      startDate = customStartDate;
      endDate = customEndDate;
    } else {
      const dates = getPresetDates(datePreset);
      if (dates) {
        startDate = dates.start;
        endDate = dates.end;
      }
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/statements/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddresses: addressesToUse,
          startDate,
          endDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate statement');
      }

      setStatement(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!statement) return;

    const escapeCSV = (field: string) => {
      // If field contains comma, quote, or newline, wrap in quotes and escape existing quotes
      if (/[\",\n]/.test(field)) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    const headers = ['Date', 'Transaction Hash', 'From', 'To', 'Token', 'Amount', 'USD Value', 'Wallet'];
    const rows = statement.transactions.map((t) => [
      new Date(t.date).toISOString(),
      t.txHash,
      t.from,
      t.to,
      t.token,
      t.amount,
      t.usdValue,
      t.walletAddress,
    ]);

    const csv = [
      headers.map(escapeCSV).join(','), 
      ...rows.map((r) => r.map(escapeCSV).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statement-${datePreset}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    
    // Delay revoke to ensure download starts
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const formatAddress = (addr: string) => {
    if (addr.length < 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Generate Statement</h1>
      <p className="text-slate-600">
        Create a bank-style statement from your wallet transaction history.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Statement Options</CardTitle>
          <CardDescription>
            Select wallets and date range for your statement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wallet Selection */}
          <div className="space-y-3">
            <Label>Select Wallets</Label>
            
            {/* Manual address input */}
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50">
              <Checkbox
                id="manual-wallet"
                checked={useManualAddress}
                onCheckedChange={(checked) => setUseManualAddress(checked === true)}
              />
              <div className="flex-1">
                <Label htmlFor="manual-wallet" className="cursor-pointer font-medium">
                  Use a wallet address
                </Label>
                {useManualAddress && (
                  <Input
                    placeholder="0x..."
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    className="mt-2 font-mono text-sm"
                  />
                )}
              </div>
            </div>

            {/* Saved wallets */}
            {wallets.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50"
                  >
                    <Checkbox
                      id={`wallet-${wallet.id}`}
                      checked={selectedWallets.includes(wallet.address)}
                      onCheckedChange={() => toggleWallet(wallet.address)}
                      disabled={useManualAddress}
                    />
                    <Label
                      htmlFor={`wallet-${wallet.id}`}
                      className={`flex-1 cursor-pointer ${useManualAddress ? 'opacity-50' : ''}`}
                    >
                      <div className="font-medium">{wallet.label || formatAddress(wallet.address)}</div>
                      <div className="text-sm text-slate-500 font-mono">{formatAddress(wallet.address)}</div>
                      <div className="text-xs text-slate-400 capitalize">{wallet.chain}</div>
                    </Label>
                  </div>
                ))}
              </div>
            )}
            
            {wallets.length === 0 && !useManualAddress && (
              <p className="text-sm text-slate-500">
                No saved wallets. Use the option above or <a href="/dashboard/wallets" className="text-blue-600 hover:underline">save wallets</a> for quick access.
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label>Date Range</Label>
            <Select value={datePreset} onValueChange={(value) => value && setDatePreset(value)}>
              <SelectTrigger className="w-full md:w-64">
                <span>{DATE_PRESETS.find(p => p.id === datePreset)?.name || datePreset}</span>
              </SelectTrigger>
              <SelectContent>
                {DATE_PRESETS.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {datePreset === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Generating...' : 'Generate Statement'}
          </Button>
        </CardContent>
      </Card>

      {/* Statement Preview */}
      {statement && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Statement Preview</h2>
              <p className="text-sm text-slate-500">
                {statement.totalTransactions} transactions • ${statement.totalIncome} total
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportCSV}>
                Export CSV
              </Button>
              <Button onClick={() => window.print()}>
                Print PDF
              </Button>
            </div>
          </div>

          <div id="statement-preview">
            <StatementPreview
              transactions={statement.transactions}
              totalIncome={statement.totalIncome}
              startDate={statement.startDate}
              endDate={statement.endDate}
              walletCount={statement.walletCount}
            />
          </div>
        </div>
      )}
    </div>
  );
}
