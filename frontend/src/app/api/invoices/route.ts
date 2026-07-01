import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logError } from "@/lib/logger";

const invoiceSchema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email().optional(),
  amount: z.string().min(1),
  token: z.string().min(1),
  dueDate: z.string().optional(),
  paymentAddress: z.string().optional(),
  userId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = invoiceSchema.parse(body);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: await generateInvoiceNumber(),
        clientName: validated.clientName,
        clientEmail: validated.clientEmail,
        amount: validated.amount,
        token: validated.token,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
        paymentTxHash: null,
        pdfUrl: null,
        userId: validated.userId || null,
        paymentAddress: validated.paymentAddress || null,
      },
    });

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    logError(error, "Invoice creation");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const invoices = await prisma.invoice.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    logError(error, "Invoice list");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function generateInvoiceNumber(): Promise<string> {
  const count = await prisma.invoice.count();
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const number = (count + 1).toString().padStart(4, "0");
  return `INV-${year}${month}${day}-${number}`;
}
