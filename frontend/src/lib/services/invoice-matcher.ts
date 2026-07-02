import { prisma } from "@/lib/db";

/**
 * Match a receipt to the most appropriate unpaid invoice
 * Returns the matched invoice or null if no match found
 */
export async function matchReceiptToInvoice(params: {
  toAddress: string;
  fromAddress: string;
  amount: string;
  token: string;
  txHash: string;
}): Promise<{
  invoice: any | null;
  matchType: "exact" | "ambiguous" | "none";
} | null> {
  try {
    const { toAddress, fromAddress, amount, token } = params;

    // Find all unpaid invoices for this payment address
    const candidates = await prisma.invoice.findMany({
      where: {
        paymentAddress: { equals: toAddress, mode: "insensitive" },
        token: { equals: token, mode: "insensitive" },
        status: { in: ["pending", "partial"] },
      },
      orderBy: { createdAt: "asc" }, // Oldest first (FIFO)
      include: { receipts: true },
    });

    if (candidates.length === 0) {
      return { invoice: null, matchType: "none" };
    }

    // Filter by clientWallet if set on invoice
    const matches = candidates.filter((inv) => {
      if (inv.clientWallet) {
        return inv.clientWallet.toLowerCase() === fromAddress.toLowerCase();
      }
      return true;
    });

    if (matches.length === 0) {
      return { invoice: null, matchType: "none" };
    }

    if (matches.length === 1) {
      return { invoice: matches[0], matchType: "exact" };
    }

    // Multiple invoices still match - ambiguous
    // Return the oldest one (FIFO) but flag as ambiguous
    return { invoice: matches[0], matchType: "ambiguous" };
  } catch (error) {
    console.error("Match receipt error:", error);
    return null;
  }
}

/**
 * Update invoice status based on new payment
 */
export async function updateInvoiceStatus(
  invoiceId: string,
  receiptAmount: string,
  invoiceAmount: string
): Promise<any> {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const newPaid = parseFloat(invoice.paidAmount || "0") + parseFloat(receiptAmount);
    const total = parseFloat(invoiceAmount);
    const remaining = total - newPaid;

    let status = "pending";
    if (remaining <= 0) {
      status = "paid";
    } else if (remaining < 0) {
      status = "overpaid";
    } else if (newPaid > 0) {
      status = "partial";
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: newPaid.toString(),
        remainingAmount: remaining > 0 ? remaining.toString() : "0",
        status,
      },
    });

    return updatedInvoice;
  } catch (error) {
    console.error("Update invoice status error:", error);
    throw error;
  }
}
