import { prisma } from "@/lib/db";

interface AutoReceiptParams {
  txHash: string;
  chain: string;
  toAddress: string;
  fromAddress: string;
  amount: string;
  token: string;
  invoiceId: string;
  userId?: string | null;
}

/**
 * Auto-generate a receipt from a detected blockchain payment
 */
export async function autoGenerateReceipt(params: AutoReceiptParams): Promise<any> {
  try {
    const { txHash, chain, toAddress, fromAddress, amount, token, invoiceId, userId } = params;

    // Get invoice details for client info
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new Error("Invoice not found for receipt generation");
    }

    // For stablecoins, use exact amount. For others, we'd need price lookup
    const usdValue = amount; // Simplified - for stablecoins this is correct

    const receipt = await prisma.receipt.create({
      data: {
        txHash,
        chain,
        fromAddress,
        toAddress,
        amount,
        token,
        usdValue,
        clientName: invoice.clientName,
        description: `Payment for Invoice ${invoice.invoiceNumber}`,
        date: new Date(),
        invoiceId,
        userId: userId || null,
      },
    });

    return receipt;
  } catch (error) {
    console.error("Auto-receipt generation error:", error);
    throw error;
  }
}
