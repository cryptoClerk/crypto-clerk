'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Wallet {
  id: string;
  address: string;
  chain: string;
  label: string | null;
  createdAt: string;
}

const SUPPORTED_CHAINS = [
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'polygon', name: 'Polygon' },
  { id: 'bsc', name: 'BSC' },
  { id: 'arbitrum', name: 'Arbitrum' },
  { id: 'optimism', name: 'Optimism' },
];

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleAddWallet = async () => {
    if (!address.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: address.trim(),
          chain,
          label: label.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add wallet');
      }

      setAddress('');
      setLabel('');
      fetchWallets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWallet = async (id: string) => {
    try {
      const res = await fetch(`/api/wallets?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchWallets();
      }
    } catch (err) {
      console.error('Failed to delete wallet:', err);
    }
  };

  const formatAddress = (addr: string) => {
    if (addr.length < 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Wallets</h1>
      <p className="text-slate-600">
        Add your crypto wallets to generate statements and track income.
      </p>

      {/* Add Wallet Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Wallet Address</Label>
              <Input
                id="address"
                placeholder="0x..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chain">Chain</Label>
              <Select value={chain} onValueChange={(value) => value && setChain(value)} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CHAINS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label (optional)</Label>
              <Input
                id="label"
                placeholder="Main Wallet"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            onClick={handleAddWallet}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Adding...' : 'Add Wallet'}
          </Button>
        </CardContent>
      </Card>

      {/* Wallets List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Wallets</CardTitle>
        </CardHeader>
        <CardContent>
          {wallets.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              No wallets added yet. Add your first wallet above.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Chain</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wallets.map((wallet) => (
                  <TableRow key={wallet.id}>
                    <TableCell className="font-mono text-sm">
                      {formatAddress(wallet.address)}
                    </TableCell>
                    <TableCell className="capitalize">{wallet.chain}</TableCell>
                    <TableCell>{wallet.label || '-'}</TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(wallet.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteWallet(wallet.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
