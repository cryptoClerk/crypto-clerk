'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';

interface Statement {
  id: string;
  startDate: string;
  endDate: string;
  chain: string;
  totalTransactions: number;
  totalIncome: string;
  walletCount: number;
  createdAt: string;
}

export default function StatementHistory() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatements();
  }, []);

  const fetchStatements = async () => {
    try {
      const res = await fetch('/api/statements/history');
      const data = await res.json();
      if (data.success) {
        setStatements(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch statements:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (statements.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500">No statement history yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Statement History</h3>
      {statements.map((statement) => (
        <Card key={statement.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {new Date(statement.startDate).toLocaleDateString()} - {new Date(statement.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-500">
                    {statement.chain} • {statement.totalTransactions} txs • ${statement.totalIncome}
                  </p>
                </div>
              </div>
              <div className="text-sm text-slate-400">
                {new Date(statement.createdAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
