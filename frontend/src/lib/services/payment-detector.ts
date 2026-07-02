import { prisma } from "@/lib/db";
import { createProviderFromEnv } from "@/lib/services/blockchain";
import { matchReceiptToInvoice, updateInvoiceStatus } from "./invoice-matcher";
import { autoGenerateReceipt } from "./receipt-generator";
import { sendPaymentNotification } from "./notification";

interface DetectedPayment {
  txHash: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  token: string;
  timestamp: string;
}

/**
 * Check all unpaid invoices for new payments
 * This is called by the cron job every 5 minutes
 */
export async function checkForPayments(): Promise<{
  checked: number;
  found: number;
  matched: number;
  errors: number;
}> {
  const results = { checked: 0, found: 0, matched: 0, errors: 0 };

  try {
    // Get all pending or partial invoices with payment addresses
    const invoices = await prisma.invoice.findMany({
      where: {
        status: { in: ["pending", "partial"] },
        paymentAddress: { not: null },
      },
      include: { receipts: true },
    });

    results.checked = invoices.length;

    for (const invoice of invoices) {
      try {
        // Check for new token transfers to this payment address
        const provider = createProviderFromEnv("ethereum"); // default to ethereum, could be configurable
        
        // Get all token transfers to this address
        const transfers = await provider.getTokenTransfers(invoice.paymentAddress!);
        
        // Filter transfers that happened after invoice was created
        // and haven't been matched yet
        const unmatchedTransfers = transfers.filter((transfer: any) => {
          const txTime = new Date(parseInt(transfer.timestamp) * 1000);
          const invoiceTime = new Date(invoice.createdAt);
          
          // Must be after invoice was created
          if (txTime <= invoiceTime) return false;
          
          // Check if already matched to a receipt
          const alreadyMatched = invoice.receipts.some(
            (r) => r.txHash === transfer.txHash
          );
          
          return !alreadyMatched;
        });

        for (const transfer of unmatchedTransfers) {
          results.found++;
          
          // Convert amount from wei to token units
          const amount = (parseFloat(transfer.value) / Math.pow(10, parseInt(transfer.tokenDecimal) || 18)).toString();
          
          // Check if token matches invoice
          if (transfer.tokenSymbol !== invoice.token) {
            console.log(`Token mismatch: invoice expects ${invoice.token}, got ${transfer.tokenSymbol}`);
            continue;
          }
          
          // Check if from_address matches clientWallet (if set)
          if (invoice.clientWallet && transfer.from !== invoice.clientWallet) {
            console.log(`From address mismatch: expected ${invoice.clientWallet}, got ${transfer.from}`);
            continue;
          }
          
          // Auto-generate receipt
          const receipt = await autoGenerateReceipt({
            txHash: transfer.txHash,
            chain: "ethereum", // could be configurable
            toAddress: transfer.to,
            fromAddress: transfer.from,
            amount,
            token: transfer.tokenSymbol,
            invoiceId: invoice.id,
            userId: invoice.userId,
          });
          
          // Update invoice status
          await updateInvoiceStatus(invoice.id, receipt.amount, invoice.amount);
          
          results.matched++;
          
          // Send notification
          await sendPaymentNotification(invoice, receipt);
          
          console.log(`✅ Payment detected for invoice ${invoice.invoiceNumber}: ${amount} ${transfer.tokenSymbol} from ${transfer.from}`);
        }
      } catch (error) {
        results.errors++;
        console.error(`Error checking invoice ${invoice.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Payment detection error:", error);
    results.errors++;
  }

  return results;
}
