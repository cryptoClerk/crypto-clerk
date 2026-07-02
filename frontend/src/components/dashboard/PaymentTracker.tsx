import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";

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
  receipts: Array<{
    id: string;
    amount: string;
    token: string;
    txHash: string;
    date: string;
  }>;
}

interface PaymentTrackerProps {
  invoices: Invoice[];
}

export default function PaymentTracker({ invoices }: PaymentTrackerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const unpaidInvoices = invoices.filter(
    (inv) => inv.status === "pending" || inv.status === "partial"
  );

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/pay/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "partial":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-amber-100 text-amber-800",
      partial: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      overpaid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || "bg-slate-100 text-slate-800"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (unpaidInvoices.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-slate-500">All invoices are paid! 🎉</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Tracker</h3>
      {unpaidInvoices.map((invoice) => (
        <Card key={invoice.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getStatusIcon(invoice.status)}
                <div>
                  <p className="font-medium">{invoice.clientName}</p>
                  <p className="text-sm text-slate-500">
                    {invoice.invoiceNumber} · {invoice.amount} {invoice.token}
                  </p>
                  {invoice.status === "partial" && (
                    <p className="text-sm text-amber-600 mt-1">
                      Paid: {invoice.paidAmount} · Remaining: {invoice.remainingAmount} {invoice.token}
                    </p>
                  )}
                  {invoice.receipts.length > 0 && (
                    <p className="text-sm text-slate-400 mt-1">
                      {invoice.receipts.length} payment receipt(s)
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {getStatusBadge(invoice.status)}
              </div>
            </div>

            {invoice.paymentAddress && (
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyLink(invoice.id)}
                  className="text-xs"
                >
                  {copiedId === invoice.id ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" /> Copy Link
                    </>
                  )}
                </Button>
                <Link href={`/pay/${invoice.id}`} target="_blank">
                  <Button variant="outline" size="sm" className="text-xs">
                    <ExternalLink className="w-3 h-3 mr-1" /> View
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
