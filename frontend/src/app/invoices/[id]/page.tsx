import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import InvoiceStatusActions from "./InvoiceStatusActions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
  });

  if (!invoice) {
    notFound();
  }

  const statusConfig = {
    pending: { color: "text-yellow-600", bg: "bg-yellow-50", icon: Clock },
    paid: { color: "text-green-600", bg: "bg-green-50", icon: CheckCircle },
    overdue: { color: "text-red-600", bg: "bg-red-50", icon: XCircle },
    cancelled: { color: "text-slate-600", bg: "bg-slate-50", icon: XCircle },
  };

  const status = statusConfig[invoice.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/invoices">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Invoices
          </Button>
        </Link>
        <InvoiceStatusActions invoice={invoice} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{invoice.invoiceNumber}</p>
              <CardTitle className="text-2xl mt-1">Invoice</CardTitle>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.bg} ${status.color}`}>
              <StatusIcon className="w-4 h-4" />
              <span className="capitalize font-medium">{invoice.status}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Bill To</h3>
              <p className="font-medium">{invoice.clientName}</p>
              {invoice.clientEmail && (
                <p className="text-slate-500 text-sm">{invoice.clientEmail}</p>
              )}
            </div>
            <div className="md:text-right">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Details</h3>
              <p className="text-sm">
                <span className="text-slate-500">Token:</span>{" "}
                <span className="font-medium">{invoice.token}</span>
              </p>
              {invoice.dueDate && (
                <p className="text-sm">
                  <span className="text-slate-500">Due Date:</span>{" "}
                  <span className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                </p>
              )}
              <p className="text-sm">
                <span className="text-slate-500">Created:</span>{" "}
                <span className="font-medium">{new Date(invoice.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500">Total Amount</p>
                <p className="text-3xl font-bold text-slate-900">
                  {invoice.amount} {invoice.token}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Payment Status</p>
                <p className={`font-medium capitalize ${
                  invoice.status === "paid" ? "text-green-600" : "text-yellow-600"
                }`}>
                  {invoice.status}
                </p>
              </div>
            </div>
          </div>

          {invoice.paymentTxHash && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Payment Details
              </h3>
              <p className="text-sm">
                <span className="text-slate-500">Transaction Hash:</span>{" "}
                <a
                  href={`https://etherscan.io/tx/${invoice.paymentTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-mono text-xs"
                >
                  {invoice.paymentTxHash}
                </a>
              </p>
            </div>
          )}

          {invoice.status === "pending" && (
            <div className="border-t pt-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Payment Instructions</h3>
                <p className="text-sm text-blue-800">
                  Please send exactly {invoice.amount} {invoice.token} to the wallet address provided by the invoice sender.
                  Once payment is confirmed, share the transaction hash to mark this invoice as paid.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
