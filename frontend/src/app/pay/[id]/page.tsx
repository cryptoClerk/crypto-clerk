import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { QRCodeSVG } from "qrcode.react";

interface PayPageProps {
  params: Promise<{ id: string }>;
}

export default async function PayPage({ params }: PayPageProps) {
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { receipts: true },
  });

  if (!invoice) {
    notFound();
  }

  // Generate a simple payment URI
  const paymentUri = invoice.paymentAddress
    ? `ethereum:${invoice.paymentAddress}?amount=${invoice.amount}&token=${invoice.token}`
    : "";

  const isPaid = invoice.status === "paid" || invoice.status === "overpaid";
  const isPartial = invoice.status === "partial";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Invoice #{invoice.invoiceNumber}</h1>
          <p className="text-slate-500 mt-1">{invoice.clientName}</p>
        </div>

        {/* Amount */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-slate-500 mb-1">Amount Due</p>
          <p className="text-3xl font-bold text-slate-900">
            {invoice.amount} {invoice.token}
          </p>
          {isPartial && (
            <p className="text-sm text-amber-600 mt-2">
              Partially paid: {invoice.paidAmount} {invoice.token} paid, {invoice.remainingAmount} {invoice.token} remaining
            </p>
          )}
          {isPaid && (
            <p className="text-sm text-green-600 mt-2">✓ Paid in full</p>
          )}
        </div>

        {/* Status badge */}
        <div className="flex justify-center mb-6">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              invoice.status === "pending"
                ? "bg-amber-100 text-amber-800"
                : invoice.status === "paid"
                ? "bg-green-100 text-green-800"
                : invoice.status === "partial"
                ? "bg-blue-100 text-blue-800"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>

        {/* QR Code */}
        {invoice.paymentAddress && !isPaid && (
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-white rounded-lg border border-slate-200">
              <QRCodeSVG value={paymentUri} size={200} />
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Scan with your wallet app to pay
            </p>
            <p className="text-xs text-slate-400 mt-1 font-mono break-all">
              {invoice.paymentAddress}
            </p>
          </div>
        )}

        {/* Receipts */}
        {invoice.receipts && invoice.receipts.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Payment Receipts</h3>
            {invoice.receipts.map((receipt) => (
              <div key={receipt.id} className="bg-slate-50 rounded-lg p-3 mb-2 text-sm">
                <p className="font-medium">
                  {receipt.amount} {receipt.token} received
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {new Date(receipt.date).toLocaleDateString()} · {receipt.txHash.slice(0, 10)}...
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-slate-400">
          <p>Powered by CryptoClerks</p>
        </div>
      </div>
    </div>
  );
}
